import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useContext } from "react";
import { X, CircleUserRound } from "lucide-react";
import "../../css/challenges/fullScreenSubmission.css";
import { getProfileIdByUserId, getUserProfileByProfileId, fetchAvatarUrl } from "../../utils/api";
import { getAuthToken } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { deleteSubmission } from "../../utils/api/challenges";
import VoteButton from "./VoteButton";
import { getChallengeDetails } from "../../utils/api/challenges";
const FullScreenSubmission = ({ submission, onClose, challengeName, votesCount: initialVotesCount, onSubmissionDeleted }) => {
    const { auth } = useContext(AuthContext);
    const authToken = getAuthToken();
    const [avatarUrl, setAvatarUrl] = useState(submission.user.avatar_url || "");
    const [votesCount, setVotesCount] = useState(initialVotesCount);
    const [challengeTitle, setChallengeTitle] = useState(challengeName);
    const [isDeleting, setIsDeleting] = useState(false);
    // Check if logged-in user is the submission owner
    const isSubmissionOwner = auth.id === submission.user.id;
    console.log("Auth Token:", authToken);
    console.log("Auth Context User ID:", auth.id);
    console.log("Submission User ID:", submission.user.id);
    console.log("Is Submission Owner:", isSubmissionOwner);
    // Fetch avatar logic (unchanged from original)
    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                if (!avatarUrl && submission.user.id) {
                    const profileId = await getProfileIdByUserId(submission.user.id);
                    if (profileId) {
                        const userProfile = await getUserProfileByProfileId(profileId);
                        if (userProfile?.avatar_id) {
                            const fetchedAvatarUrl = await fetchAvatarUrl(userProfile.avatar_id);
                            if (fetchedAvatarUrl) {
                                setAvatarUrl(fetchedAvatarUrl);
                            }
                        }
                    }
                }
            }
            catch (error) {
                console.error("Error fetching avatar URL:", error);
            }
        };
        fetchAvatar();
    }, [avatarUrl, submission.user.id]);
    // Fetch challenge title based on sponsor_challenge_id
    useEffect(() => {
        const fetchChallengeTitle = async () => {
            try {
                const challengeData = await getChallengeDetails(submission.challenge_id);
                if (challengeData?.title) {
                    setChallengeTitle(challengeData.title);
                }
            }
            catch (error) {
                console.error("Error fetching challenge details:", error);
            }
        };
        // Only fetch challenge title if not already provided via props
        if (!challengeName) {
            fetchChallengeTitle();
        }
        else {
            setChallengeTitle(challengeName);
        }
    }, [submission.challenge_id, challengeName]);
    // Handle deletion of the submission
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this submission?")) {
            return;
        }
        try {
            setIsDeleting(true);
            const challengeId = submission.challenge_id;
            if (!challengeId) {
                console.error("Challenge ID is missing in submission.");
                return;
            }
            await deleteSubmission(submission.id, challengeId);
            console.log(`Submission ${submission.id} deleted`);
            // Remove the submission from state in the parent
            onSubmissionDeleted(submission.id);
            // Close the fullscreen view
            onClose();
            alert("Submission deleted successfully");
        }
        catch (error) {
            console.error("Error deleting submission:", error);
        }
        finally {
            setIsDeleting(false);
        }
    };
    // Handle closing the modal
    const handleClose = () => {
        onClose(); // Trigger the onClose function passed via props
    };
    return (_jsxs("div", { className: "fullscreen-post", children: [_jsx("button", { className: "close-button", onClick: handleClose, children: _jsx(X, { size: 36, color: "#e3e3e3" }) }), _jsxs("div", { className: "post-header", children: [avatarUrl ? (_jsx("img", { src: avatarUrl, alt: `${submission.user.username}'s avatar`, className: "avatar" })) : (_jsx(CircleUserRound, { color: "#131313", size: 80 })), _jsxs("div", { children: [_jsx("p", { className: "username", children: submission.user.username }), _jsxs("p", { className: "challenge-name", children: ["Challenge: ", challengeTitle || "Loading..."] })] })] }), _jsx("div", { className: "post-image", children: _jsx("img", { src: submission.image_path, alt: "Submission content" }) }), _jsxs("div", { className: "desc-del-container", children: [submission.description && (_jsx("div", { className: "submission-description", children: _jsx("p", { children: submission.description }) })), isSubmissionOwner && (_jsx("div", { className: "delete-submission-container", children: _jsx("button", { className: "delete-submission-button", onClick: handleDelete, disabled: isDeleting, children: isDeleting ? "Deleting..." : "Delete Submission" }) }))] }), _jsx("div", { className: "post-actions", children: _jsxs("div", { className: "icon-container-full-post", children: [_jsx(VoteButton, { challengeId: submission.challenge_id, submissionId: submission.id, setVotesCount: setVotesCount }), _jsxs("span", { children: [votesCount, " votes"] })] }) })] }));
};
export default FullScreenSubmission;
