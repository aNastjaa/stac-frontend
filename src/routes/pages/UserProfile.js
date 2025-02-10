import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserIdFromLocalStorage, getProfileIdByUserId, getUserProfileByProfileId, fetchAvatarUrl, fetchUserArtworks, } from '../../utils/api';
import { CircleUserRound } from 'lucide-react';
import '../../css/userProfile.css';
import { ButtonCTA, ButtonLong, ButtonPrimary } from '../../components/Buttons';
import ArtworkCard from '../../components/artworks/ArtworkCard';
import FullScreenPost from '../../components/artworks/FullScreenPost';
import ProfileStats from '../../components/profile/ProfileStats';
import SubmissionCard from '../../components/challenges/SubmissionCard';
import { getChallenges, getSubmissions } from '../../utils/api/challenges';
import DotLoader from '../../components/DotLoader'; // Import the loader
import FullScreenProUpgrade from '../../components/FullScreenProUpgrade';
const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState(null);
    const [artworks, setArtworks] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [role, setRole] = useState('');
    const [selectedArtwork, setSelectedArtwork] = useState(null);
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
                const filteredArtworks = userArtworks.filter((artwork) => artwork.user.id === userId);
                setArtworks(filteredArtworks);
                // Fetch all challenges and submissions
                const challenges = await getChallenges();
                const allSubmissions = [];
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
            }
            catch (error) {
                console.error('Error fetching profile data', error);
                setLoading(false);
                navigate('/edit-profile');
            }
        };
        fetchProfileData();
    }, [navigate]);
    const handleArtworkClick = (artwork) => {
        setSelectedArtwork(artwork);
    };
    const handleCloseFullScreenPost = () => {
        setSelectedArtwork(null);
    };
    const handleDeleteArtwork = (artworkId) => {
        setArtworks((prevArtworks) => prevArtworks.filter((artwork) => artwork.id !== artworkId));
    };
    const handleSubmissionDeleted = (submissionId) => {
        console.log(`Submission with ID ${submissionId} deleted`);
        setSubmissions((prevState) => {
            const newState = prevState.filter((submission) => submission.id !== submissionId);
            console.log("Updated submissions:", newState);
            return newState;
        });
    };
    return (_jsxs("div", { className: "profile-container", children: [loading ? (_jsx(DotLoader, {})) : profile ? (_jsxs("div", { className: "container", children: [_jsxs("div", { className: "profile-content", children: [_jsxs("div", { className: "profile-header", children: [_jsx("div", { className: "profile-header-left", children: _jsxs("h2", { children: ["@", username] }) }), _jsx("div", { className: "profile-header-right", children: _jsx(ButtonPrimary, { text: "Edit Profile", onClick: () => navigate('/edit-profile') }) })] }), _jsxs("div", { className: "profile-avatar-stats", children: [avatarUrl ? (_jsx("img", { src: avatarUrl, alt: "User Avatar", className: "profile-avatar" })) : (_jsx(CircleUserRound, { color: "#131313", size: 80 })), artworks.length > 0 && _jsx(ProfileStats, { artworks: artworks })] }), _jsx("div", { className: "profile-fullname", children: _jsx("p", { children: profile.full_name || 'Full Name Not Provided' }) }), _jsx("div", { className: "profile-bio", children: _jsx("p", { children: profile.bio || 'Bio Not Provided' }) })] }), _jsx("div", { className: "user-artworks", children: artworks.length > 0 ? (artworks.map((artwork) => (_jsx(ArtworkCard, { artwork: artwork, onClick: () => handleArtworkClick(artwork), userId: artwork.user.id, isPending: artwork.status === 'pending' }, artwork.id)))) : (_jsxs("div", { className: "artwork-empty-placeholder", children: [_jsx("span", { className: 'row', children: "You don\u2019t have any artworks yet! " }), _jsxs("span", { className: 'row', children: ["Go to the ", _jsx(Link, { to: "/artworks", className: "link-highlight-artwork", children: "Artwork page" }), " and start sharing."] })] })) }), _jsxs("div", { className: "sponsor-challenges", children: [_jsx("h3", { children: "Sponsor Challenges" }), role === "basic" ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "submission-upgrade-placeholder", children: [_jsxs("p", { children: ["Unlock Sponsor Challenges by upgrading to Pro! ", _jsx("br", {}), "Only Pro users can submit their work and collaborate with top brands."] }), _jsx(ButtonCTA, { text: "Upgrade to Pro", onClick: () => setShowUpgradeModal(true), link: "#" })] }), showUpgradeModal && _jsx(FullScreenProUpgrade, { onClose: () => setShowUpgradeModal(false) })] })) : submissions.length === 0 ? (
                            /* Empty Submissions Placeholder */
                            _jsxs("div", { className: "sponsor-submission-empty-placeholder", children: [_jsx("span", { className: "row", children: "Here you will see your Sponsor Submissions, but you don\u2019t have any yet \uD83D\uDC40" }), _jsxs("span", { className: "row", children: ["Go to ", _jsx(Link, { to: "/sponsor-challenges", className: "link-highlight", children: "Sponsor Challenges" }), " and try yourself!"] }), _jsx("span", { className: "row", children: "Winners will get a collaboration with the brand, cool yeah? \uD83D\uDE80" })] })) : (
                            /* Submissions Gallery */
                            _jsx("section", { className: "submissions-gallery", children: _jsx("div", { className: "submissions-container", children: submissions.map((submission) => (_jsx(SubmissionCard, { submission: submission, challenge: submission.challengeName || "", isPending: submission.status === "pending", onSubmissionDeleted: handleSubmissionDeleted }, submission.id))) }) }))] })] })) : (_jsxs("div", { className: "profile-not-found", children: [_jsxs("h2", { children: ["Hello ", username || 'there', "!"] }), _jsxs("p", { children: ["Oh wow, you're visiting for the first time! \uD83D\uDE4C ", _jsx("br", {}), "Please fill out your profile to continue."] }), _jsx(ButtonLong, { text: "Complete Your Profile", onClick: () => navigate('/edit-profile') })] })), selectedArtwork && (_jsx(FullScreenPost, { post: {
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
                }, onClose: handleCloseFullScreenPost, onPostDeleted: handleDeleteArtwork }))] }));
};
export default UserProfile;
