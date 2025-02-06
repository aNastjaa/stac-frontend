import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  getUserIdFromLocalStorage,
  getProfileIdByUserId,
  getUserProfileByProfileId,
  fetchAvatarUrl,
  fetchUserArtworks,
} from '../../utils/api';
import { CircleUserRound } from 'lucide-react';
import '../../css/userProfile.css';
import { ButtonCTA, ButtonLong, ButtonPrimary } from '../../components/Buttons';
import { UserProfileType, ArtworkResponse, Submission } from '../../utils/types';
import ArtworkCard from '../../components/artworks/ArtworkCard';
import FullScreenPost from '../../components/artworks/FullScreenPost';
import ProfileStats from '../../components/profile/ProfileStats';
import SubmissionCard from '../../components/challenges/SubmissionCard';
import { getChallenges, getSubmissions } from '../../utils/api/challenges';
import DotLoader from '../../components/DotLoader';  // Import the loader
import FullScreenProUpgrade from '../../components/FullScreenProUpgrade';

const UserProfile = () => {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);
  const [artworks, setArtworks] = useState<ArtworkResponse[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [role, setRole] = useState<string>('');
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkResponse | null>(null);
  const navigate = useNavigate();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

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
      setRole(parsedUser.role_name || '');
    }

    const fetchProfileData = async () => {
      try {
        const profileId = await getProfileIdByUserId(userId);
        if (profileId) {
          const userProfile = await getUserProfileByProfileId(profileId);
          setProfile(userProfile);

          if (userProfile?.avatar_id) {
            const avatarUrl = await fetchAvatarUrl(userProfile.avatar_id);
            setAvatarUrl(avatarUrl || '');
          }
        }

        const userArtworks = await fetchUserArtworks(userId);
        const filteredArtworks = userArtworks.filter(
          (artwork) => artwork.user.id === userId
        );
        setArtworks(filteredArtworks);

        // Fetch all challenges and submissions
        const challenges = await getChallenges();
        const allSubmissions: Submission[] = [];

        for (const challenge of challenges) {
          const submissions = await getSubmissions(challenge.id);

          const userSubmissions = submissions
            .filter((submission) => submission.user_id === userId)
            .map((submission) => ({
              ...submission,
              challengeName: challenge.title, // Map challenge title to challengeName
            }));

          allSubmissions.push(...userSubmissions);
        }

        setSubmissions(allSubmissions);
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

  const handleDeleteArtwork = (artworkId: string) => {
    setArtworks((prevArtworks) =>
      prevArtworks.filter((artwork) => artwork.id !== artworkId)
    );
  };

  return (
    <div className="profile-container">
      {loading ? (
        <DotLoader />
      ) : profile ? (
        <div className="container">
          {/* Profile Header */}
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

              {artworks.length > 0 && <ProfileStats artworks={artworks} />}
            </div>

            <div className="profile-fullname">
              <p>{profile.full_name || 'Full Name Not Provided'}</p>
            </div>
            <div className="profile-bio">
              <p>{profile.bio || 'Bio Not Provided'}</p>
            </div>
          </div>

          {/* Artworks */}
          <div className="user-artworks">
            {artworks.length > 0 ? (
              artworks.map((artwork) => (
                <ArtworkCard
                  key={artwork.id}
                  artwork={artwork}
                  onClick={() => handleArtworkClick(artwork)}
                  userId={artwork.user.id}
                  isPending={artwork.status === 'pending'}
                />
              ))
            ) : (
              <div className="artwork-empty-placeholder">
                <span className='row'>You don’t have any artworks yet! </span>
                <span className='row'>Go to the <Link to="/artworks" className="link-highlight-artwork">Artwork page</Link> and start sharing.</span>
              </div>
            )}
          </div>

          {/* Sponsor Challenges */}
          <div className="sponsor-challenges">
            <h3>Sponsor Challenges</h3>

            {role === "basic" ? (
              <>
                {/* Upgrade Placeholder */}
                <div className="submission-upgrade-placeholder">
                  <p>
                    Unlock Sponsor Challenges by upgrading to Pro! <br />
                    Only Pro users can submit their work and collaborate with top brands.
                  </p>
                  <ButtonCTA text="Upgrade to Pro" onClick={() => setShowUpgradeModal(true)} link="#" />
                </div>

                {/* FullScreenProUpgrade Modal */}
                {showUpgradeModal && <FullScreenProUpgrade onClose={() => setShowUpgradeModal(false)} />}
              </>
                ) : submissions.length === 0 ? (
                  /* Empty Submissions Placeholder */
                  <div className="sponsor-submission-empty-placeholder">
                    <span className="row">Here you will see your Sponsor Submissions, but you don’t have any yet 👀</span>
                    <span className="row">
                      Go to <Link to="/sponsor-challenges" className="link-highlight">Sponsor Challenges</Link> and try yourself!
                    </span>
                    <span className="row">Winners will get a collaboration with the brand, cool yeah? 🚀</span>
                  </div>
                ) : (
                  /* Submissions Gallery */
                  <section className="submissions-gallery">
                    <div className="submissions-container">
                      {submissions.map((submission) => (
                        <SubmissionCard
                          key={submission.id}
                          submission={submission}
                          challenge={submission.challengeName || ""}
                          isPending={submission.status === "pending"}
                        />
                      ))}
                    </div>
                  </section>
                )}
           </div>
        </div>
      ) : (
        <div className="profile-not-found">
          <h2>Hello {username || 'there'}!</h2>
          <p>Oh wow, you're visiting for the first time! 🙌 <br/>
          Please fill out your profile to continue.</p>
          <ButtonLong text="Complete Your Profile" onClick={() => navigate('/edit-profile')} />
        </div>
      )}

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
          onPostDeleted={handleDeleteArtwork}
        />
      )}
    </div>
  );
};

export default UserProfile;
