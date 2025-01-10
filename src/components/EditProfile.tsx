import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Use useNavigate from react-router-dom v6
import { getUserProfile, updateUserProfile, createUserProfile, uploadAvatar } from '../utils/api';  // Import the necessary API functions
import { ButtonLong } from '../components/Buttons';  // Assuming you have a ButtonLong component
import type { UserProfile } from '../utils/api';  // Type-only import for UserProfile
import '../css/userProfile.css';

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
  const [loading, setLoading] = useState<boolean>(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const fetchedProfile = await getUserProfile();
        if (fetchedProfile) {
          setProfile(fetchedProfile);  
        } else {
          setProfile({
            username: '',
            avatar_url: null,
            posts_count: 0,
            comments_count: 0,
            likes_count: 0,
            full_name: '',
            bio: '',
            external_links: [],
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile', error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!profile) return;

    try {
      if (profile.username) {
        const updatedProfile = await updateUserProfile(profile);  // Update if profile exists
        console.log('Profile updated', updatedProfile);
      } else {
        const createdProfile = await createUserProfile(profile);  // Create if profile does not exist
        console.log('Profile created', createdProfile);
      }

      if (avatarFile) {
        const uploadResponse = await uploadAvatar(avatarFile);  // Upload avatar if changed
        console.log('Avatar uploaded', uploadResponse);
      }

      navigate('/profile');  // Navigate to profile page after saving
    } catch (error) {
      console.error('Error saving profile', error);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const renderProfileForm = () => {
    if (loading) {
      return <p>Loading profile...</p>;
    }

    return (
      <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
        <label>
          Full Name:
          <input
            type="text"
            value={profile.full_name || ''}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
          />
        </label>
        <label>
          Bio:
          <textarea
            value={profile.bio || ''}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
        </label>
        <label>
          Avatar:
          <input type="file" onChange={handleAvatarChange} />
        </label>
        <ButtonLong text="Save Profile" onClick={handleSaveProfile} />
      </form>
    );
  };

  return (
    <div className="edit-profile-container">
      <h1>Edit Profile</h1>
      {renderProfileForm()}
    </div>
  );
};

export default EditProfile;