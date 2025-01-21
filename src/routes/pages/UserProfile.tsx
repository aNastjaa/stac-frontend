import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserIdFromLocalStorage, getProfileIdByUserId, getUserProfileByProfileId, fetchAvatarUrl, fetchUserArtworks } from '../../utils/api';  // Use the new fetchUserArtworks
import { CircleUserRound } from 'lucide-react';  // Circle icon from Lucide
import '../../css/userProfile.css';
import { ButtonCTA, ButtonPrimary} from '../../components/Buttons';  // Added ButtonCta
import { UserProfileType, ArtworkResponse } from '../../utils/types';
import ArtworkCard from '../../components/artworks/ArtworkCard';  // Assuming you have this component

const UserProfile = () => {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);
  const [artworks, setArtworks] = useState<ArtworkResponse[]>([]);  // State for artworks
  const [role, setRole] = useState<string>('');  // State to hold user role
  const navigate = useNavigate();

  useEffect(() => {
    const userId = getUserIdFromLocalStorage();

    if (!userId) {
      console.error('No user ID found in localStorage');
      setLoading(false);
      navigate('/login');
      return;
    }

    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUsername(parsedUser.username || 'there');
      setRole(parsedUser.role_name || '');  // Set role from localStorage
    }

    const fetchProfileData = async () => {
      try {
        const profileId = await getProfileIdByUserId(userId);
        if (profileId) {
          const userProfile = await getUserProfileByProfileId(profileId);
          setProfile(userProfile);

          if (userProfile && userProfile.avatar_id) {
            const avatarUrl = await fetchAvatarUrl(userProfile.avatar_id);
            setAvatarUrl(avatarUrl || '');
          }
        }

        // Fetch artworks related to the user
        const userArtworks = await fetchUserArtworks(userId);  // Corrected: Only pass userId
        setArtworks(userArtworks);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile data', error);
        setLoading(false);
        navigate('/edit-profile');
      }
    };

    fetchProfileData();
  }, [navigate]);

  const renderProfileInfo = () => {
    if (loading) {
      return <p>Loading profile...</p>;
    }

    if (profile) {
      return (
        <div className="container">
          <div className="profile-content">
            <div className="profile-header">
              <div className="profile-header-left">
                <h2>@{username}</h2>
              </div>
              <div className="profile-header-right">
                <ButtonPrimary text="Edit Profile" onClick={() => navigate('/edit-profile')} />
              </div>
            </div>

            <div className="profile-avatar-stats">
              {avatarUrl ? (
                <img src={avatarUrl} alt="User Avatar" className="profile-avatar" />
              ) : (
                <CircleUserRound color="#131313" size={80} />
              )}

              <div className="profile-stats">
                <p>{profile.posts_count}0<br />Posts</p>
                <p>{profile.comments_count}0<br />Comments</p>
                <p>{profile.likes_count}0<br />Likes</p>
              </div>
            </div>

            <div className="profile-fullname">
              <p>{profile.full_name || 'Full Name Not Provided'}</p>
            </div>
            <div className="profile-bio">
              <p>{profile.bio || 'Bio Not Provided'}</p>
            </div>
        </div>
            {/* Display user artworks */}
            <div className="user-artworks">
              {artworks.length > 0 ? (
                artworks.map((artwork) => <ArtworkCard key={artwork.id} artwork={artwork} />)
              ) : (
                <p>No artworks to display</p>
              )}
            </div>

            {/* Display Sponsor Challenges Section */}
            <div className="sponsor-challenges">
              <h3>Sponsor challenges</h3>
              {role === 'basic' ? (
                <>
                  <p>Unlock Sponsor Challenges by upgrading to Pro! <br/> Only Pro users can submit their work and collaborate with top brands.</p>
                  <ButtonCTA text="Upgrade to Pro" onClick={() => {}} link='/' /> {/* Placeholder button */}
                </>
              ) : (
                <div>
                  <p>Here are your Sponsor Submissions:</p>
                  {/* Placeholder for future sponsor submissions */}
                  <p>No submissions yet.</p>
                </div>
              )}
            </div>

          
        </div>
      );
    }

    return (
      <div className="profile-not-found">
        <h2>Hello {username || 'there'}!</h2>
        <p>Oh wow, you're visiting for the first time! 🙌 We're so excited to get to know you better.</p>
        <p>Before you can continue, please fill out your profile. It will only take a minute, we promise! 😊</p>
        <ButtonPrimary text="Complete Your Profile" onClick={() => navigate('/edit-profile')} />
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
