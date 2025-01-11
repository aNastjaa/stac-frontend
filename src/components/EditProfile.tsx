import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserIdFromLocalStorage, getProfileIdByUserId, getUserProfileByProfileId, createUserProfile, updateUserProfile, uploadAvatar } from '../utils/api';  // Import necessary API functions
import { ButtonLong, ButtonPrimary, ButtonCTA } from '../components/Buttons';  // Assuming you have ButtonLong, ButtonPrimary, and ButtonCTA components
import type { UserProfile } from '../utils/api';  // Type-only import for UserProfile
import '../css/userProfile.css';
import { CircleUserRound} from 'lucide-react';  // Import CircleUserRound SVG from Lucide

const EditProfile = () => {
  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    avatar_url: null,
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
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile on mount
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
        setAvatarPreview(reader.result as string);  // Set preview of the selected avatar
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      let updatedProfile;
      if (isNewProfile) {
        updatedProfile = await createUserProfile(profile);
        alert('Profile created successfully!');
      } else {
        updatedProfile = await updateUserProfile(profile);
        alert('Profile updated successfully!');
      }

      setProfile(updatedProfile);

      if (avatarFile) {
        const uploadResponse = await uploadAvatar(avatarFile);  // Upload avatar
        alert('Avatar uploaded successfully!');
        setProfile((prevProfile) => ({
          ...prevProfile,
          avatar_url: uploadResponse.file_url,  // Update avatar URL in profile
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

  return (
    <div className="edit-profile">
      <div className="header-section">
        <h2>{profile.full_name ? 'Edit your profile' : 'Create your account'}</h2>
      </div>

      {/* Avatar Section */}
      <div className="avatar-section">
        <div className="avatar-container">
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar Preview" className="profile-avatar-thumbnail" />
          ) : profile.avatar_url ? (
            <img src={profile.avatar_url} alt="User Avatar" className="profile-avatar" />
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

      {/* Full Name Input */}
      <div className="full-name-input">
        <label>Full Name</label>
        <input
          type="text"
          placeholder="Full Name"
          value={profile.full_name || ''}
          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
        />
      </div>

      {/* Bio Input */}
      <div className="bio-input">
        <label>Bio</label>
        <textarea
          placeholder="Add your bio here"
          value={profile.bio || ''}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        />
      </div>

      {/* Links Section */}
      <div className="links-section">
        <label>Links</label>
        <ButtonCTA text="Upgrade to Pro" link="/" />
      </div>

      {/* Save Button */}
      <ButtonLong text="Save" onClick={handleSaveProfile} />
      
      {/* Error Message */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default EditProfile;
