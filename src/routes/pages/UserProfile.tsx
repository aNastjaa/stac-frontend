import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserIdFromLocalStorage, getProfileIdByUserId, getUserProfileByProfileId, fetchAvatarUrl, fetchUserArtworks } from '../../utils/api';
import { CircleUserRound } from 'lucide-react';
import '../../css/userProfile.css';
import { ButtonCTA, ButtonPrimary } from '../../components/Buttons';
import { UserProfileType, ArtworkResponse } from '../../utils/types';
import ArtworkCard from '../../components/artworks/ArtworkCard';
import FullScreenPost from '../../components/artworks/FullScreenPost';
import ProfileStats from '../../components/profile/ProfileStats';

const UserProfile = () => {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);
  const [artworks, setArtworks] = useState<ArtworkResponse[]>([]);
  const [role, setRole] = useState<string>('');
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkResponse | null>(null);
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
        const userArtworks = await fetchUserArtworks(userId);
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

  const handleArtworkClick = (artwork: ArtworkResponse) => {
    setSelectedArtwork(artwork);
  };

  const handleCloseFullScreenPost = () => {
    setSelectedArtwork(null);
  };

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

              {/* Integrating ProfileStats with artworks */}
              {artworks && artworks.length > 0 && <ProfileStats artworks={artworks} />}
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
              artworks.map((artwork) => (
                <ArtworkCard
                  key={artwork.id}
                  artwork={artwork}
                  onClick={() => handleArtworkClick(artwork)}
                  userId={artwork.user.id}
                />
              ))
            ) : (
              <p>No artworks to display</p>
            )}
          </div>

          {/* Display Sponsor Challenges Section */}
          <div className="sponsor-challenges">
            <h3>Sponsor challenges</h3>
            {role === 'basic' ? (
              <>
                <p>Unlock Sponsor Challenges by upgrading to Pro! <br /> Only Pro users can submit their work and collaborate with top brands.</p>
                <ButtonCTA text="Upgrade to Pro" onClick={() => {}} link="/" />
              </>
            ) : (
              <div>
                <p>Here are your Sponsor Submissions:</p>
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

      {/* Display FullScreenPost if selectedArtwork is not null */}
      {selectedArtwork && (
        <FullScreenPost
          post={{
            id: selectedArtwork.id,
            imageUrl: selectedArtwork.image_path,
            username: selectedArtwork.user.username,
            avatarUrl: selectedArtwork.user.avatar_url,
            userId: selectedArtwork.user.id,
            themeName: selectedArtwork.theme.theme_name,
            likes_count: selectedArtwork.likes,
            comments_count: selectedArtwork.comments?.length ?? 0,
            createdAt: selectedArtwork.created_at,
            description: selectedArtwork.description,
          }}
          onClose={handleCloseFullScreenPost}
        />
      )}
    </div>
  );
};

export default UserProfile;
