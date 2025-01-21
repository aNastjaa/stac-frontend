import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getUserIdFromLocalStorage, getProfileIdByUserId, getUserProfileByProfileId, createUserProfile, updateUserProfile, uploadAvatar, fetchAvatarUrl, deleteUserAccount, logout, getCsrfTokenFromCookie } from '../utils/api';  
import { ButtonLong, ButtonPrimary, ButtonCTA } from '../components/Buttons';  
import '../css/userProfile.css';
import { CircleUserRound } from 'lucide-react';  
import { UserProfileType } from '../utils/types';


const EditProfile = () => {
  const [profile, setProfile] = useState<UserProfileType>({
    username: '',
    avatar_url: null,
    avatar_id: '',
    posts_count: 0,
    comments_count: 0,
    likes_count: 0,
    full_name: '',
    bio: '',
    external_links: [],
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isAvatarEditMode, setIsAvatarEditMode] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isNewProfile, setIsNewProfile] = useState<boolean>(false);
  const [avatarUrls, setAvatarUrls] = useState<{ [key: string]: string | null }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = getUserIdFromLocalStorage();
        if (!userId) {
          console.error('No user ID found in localStorage');
          navigate('/login');
          return;
        }

        const profileId = await getProfileIdByUserId(userId);
        if (profileId) {
          const userProfile = await getUserProfileByProfileId(profileId);
          if (userProfile) {
            setProfile(userProfile);
            setIsNewProfile(false);  // Profile exists, it's not new

            if (userProfile.avatar_url) {
              const avatarUrl = await fetchAvatarUrl(userProfile.avatar_url);
              setAvatarUrls({ [profileId]: avatarUrl });
            }
          }
        } else {
          setIsNewProfile(true);  // No profile found, create a new one
        }
      } catch (error) {
        console.error('Error fetching user profile', error);
        setIsNewProfile(true);  // Treat as a new profile in case of error
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      let updatedProfile;
      if (isNewProfile) {
        updatedProfile = await createUserProfile({
          ...profile,
          avatar_id: avatarFile ? (await uploadAvatar(avatarFile)).id : profile.avatar_id,
        });
        alert('Profile created successfully!');
      } else {
        updatedProfile = await updateUserProfile({
          ...profile,
          avatar_id: avatarFile ? (await uploadAvatar(avatarFile)).id : profile.avatar_id,
        });
        alert('Profile updated successfully!');
      }
  
      setProfile(updatedProfile);
  
      if (avatarFile) {
        const uploadResponse = await uploadAvatar(avatarFile);  
        const avatarId = uploadResponse.id;
        alert('Avatar uploaded successfully!');
        setProfile((prevProfile) => ({
          ...prevProfile,
          avatar_id: avatarId,
        }));
      }
  
      navigate('/profile');
    } catch (error) {
      console.error('Error saving profile', error);
      setErrorMessage('Error saving profile');
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      alert('Avatar deleted successfully');
    } catch (error) {
      console.error('Error deleting avatar', error);
      alert('Error deleting avatar');
    }
  };

  const handleLogout = async () => {
    try {
      // Fetch the CSRF token from cookies
      const csrfToken = getCsrfTokenFromCookie();
      if (!csrfToken) {
        throw new Error('CSRF token not found');
      }
  
      // Call the logout function with the CSRF token
      await logout(csrfToken);
  
      // Redirect to the login page
      navigate('/login');
      alert('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Failed to log out');
    }
  };
  

  const handleDeleteAccount = async () => {
    try {
      await deleteUserAccount();
      navigate('/login');
      alert('Account deleted successfully');
    } catch (error) {
      console.error('Error deleting account', error);
      alert('Failed to delete account');
    }
  };

  return (
    <div className="edit-profile">
      <div className="header-section">
        <h2>{profile.full_name ? 'Edit your profile' : 'Create your account'}</h2>
      </div>

      <div className="avatar-section">
        <div className="avatar-container">
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar Preview" className="profile-avatar-thumbnail" />
          ) : profile.avatar_url ? (
            <img src={avatarUrls[profile.avatar_url] || ''} alt="User Avatar" className="profile-avatar" />
          ) : (
            <CircleUserRound color="#131313" size={100} />
          )}
        </div>
        {isAvatarEditMode && (
          <div>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>
        )}
        <div className="avatar-actions">
          <ButtonPrimary text="Edit Avatar" onClick={() => setIsAvatarEditMode((prev) => !prev)} />
          <ButtonPrimary text="Delete Avatar" onClick={handleDeleteAvatar} />
        </div>
      </div>

      <div className="full-name-input">
        <label>Full Name</label>
        <input
          type="text"
          placeholder="Full Name"
          value={profile.full_name || ''}
          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
        />
      </div>

      <div className="bio-input">
        <label>Bio</label>
        <textarea
          placeholder="Add your bio here"
          value={profile.bio || ''}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        />
      </div>

      <div className="links-section">
        <label>Links</label>
        <ButtonCTA text="Upgrade to Pro" link="/" />
      </div>

      <ButtonLong text="Save" onClick={handleSaveProfile} />
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Log Out and Delete Account Buttons */}
      <div className="action-buttons-profile">
        <ButtonPrimary text="Log Out" onClick={handleLogout} />
        <ButtonPrimary className="delete-account-button" text="Delete Account" onClick={handleDeleteAccount} />
      </div>
    </div>
  );
};

export default EditProfile;
