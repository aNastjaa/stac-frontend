import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../../utils/api';  // Import the API function
import type { UserProfile } from '../../utils/api';  // Ensure UserProfile is correctly imported
import { CircleUserRound } from 'lucide-react';  // Circle icon from Lucide
import '../../css/userProfile.css';
import { ButtonLong } from '../../components/Buttons';

const UserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('auth_user') ? JSON.parse(localStorage.getItem('auth_user')!).username : null;
    setUsername(storedUsername);

    const fetchProfile = async () => {
      try {
        const userProfile = await getUserProfile();
        setProfile(userProfile);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile', error);
        setLoading(false);
        navigate('/edit-profile');  // Redirect to EditProfile if profile is not found
      }
    };

    fetchProfile();
  }, [navigate]);

  const renderProfileInfo = () => {
    if (loading) {
      return <p>Loading profile...</p>;
    }

    if (profile) {
      return (
        <div className="profile-content">
          <div className="profile-header">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="User Avatar"
                className="profile-avatar"
              />
            ) : (
              <CircleUserRound color="#131313" size={60} />
            )}
            <div className="profile-info">
              <h2>{profile.username}</h2>
              <p>{profile.full_name || 'Full Name Not Provided'}</p>
              <p>{profile.bio || 'Bio Not Provided'}</p>
            </div>
          </div>
          <div className="profile-stats">
            <p>Posts: {profile.posts_count}</p>
            <p>Comments: {profile.comments_count}</p>
            <p>Likes: {profile.likes_count}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="profile-not-found">
        <h2>Hello {username || 'there'}!</h2>
        <p>Oh wow, you're visiting for the first time! 🙌 We're so excited to get to know you better.</p>
        <p>Before you can continue, please fill out your profile. It will only take a minute, we promise! 😊</p>
        <ButtonLong text="Complete Your Profile" onClick={() => navigate('/edit-profile')} />
      </div>
    );
  };

  return (
    <div className="profile-container">
      {renderProfileInfo()}
    </div>
  );
};

export default UserProfile;
