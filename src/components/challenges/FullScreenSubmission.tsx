import { useState, useEffect, useContext } from "react";
import { X, CircleUserRound } from "lucide-react";
import "../../css/challenges/fullScreenSubmission.css";
import { Submission } from "../../utils/types"; // Assuming Submission is defined in utils/types
import { getProfileIdByUserId, getUserProfileByProfileId, fetchAvatarUrl } from "../../utils/api";
import { getAuthToken } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { deleteSubmission } from "../../utils/api/challenges"; 
import VoteButton from "./VoteButton";
import { getChallengeDetails } from "../../utils/api/challenges";

interface FullScreenSubmissionProps {
  submission: Submission;
  onClose: () => void;
  challengeName: string;
  votesCount: number;
  onSubmissionDeleted: (submissionId: string) => void;
}

const FullScreenSubmission = ({
  submission,
  onClose,
  challengeName,
  votesCount: initialVotesCount,
  onSubmissionDeleted
}: FullScreenSubmissionProps) => {
  const { auth } = useContext(AuthContext);
  const authToken = getAuthToken();
  const [avatarUrl, setAvatarUrl] = useState<string>(submission.user.avatar_url || "");
  const [votesCount, setVotesCount] = useState<number>(initialVotesCount);
  const [challengeTitle, setChallengeTitle] = useState<string>(challengeName);
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
      } catch (error) {
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
      } catch (error) {
        console.error("Error fetching challenge details:", error);
      }
    };

    // Only fetch challenge title if not already provided via props
    if (!challengeName) {
      fetchChallengeTitle();
    } else {
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
    } catch (error) {
      console.error("Error deleting submission:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  // Handle closing the modal
  const handleClose = () => {
    onClose(); // Trigger the onClose function passed via props
  };

  return (
    <div className="fullscreen-post">
      {/* Close Button */}
      <button className="close-button" onClick={handleClose}>
        <X size={36} color="#e3e3e3" />
      </button>

      {/* Submission Header */}
      <div className="post-header">
        {avatarUrl ? (
          <img src={avatarUrl} alt={`${submission.user.username}'s avatar`} className="avatar" />
        ) : (
          <CircleUserRound color="#131313" size={80} />
        )}
        <div>
          <p className="username">{submission.user.username}</p>
          <p className="challenge-name">Challenge: {challengeTitle || "Loading..."}</p>
        </div>
      </div>
      
      {/* Submission Image */}
      <div className="post-image">
        <img src={submission.image_path} alt="Submission content" />
      </div>

      {/* Description and Delete Button */}
      <div className="desc-del-container">
        {submission.description && (
          <div className="submission-description">
            <p>{submission.description}</p>
          </div>
        )}

        {/* Delete Button (Only for Submission Owner) */}
        {isSubmissionOwner && (
          <div className="delete-submission-container">
            <button
              className="delete-submission-button"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Submission"}
            </button>
          </div>
        )}
      </div>

      {/* Submission Actions */}
      <div className="post-actions">
        <div className="icon-container-full-post">
          <VoteButton
            challengeId={submission.challenge_id}
            submissionId={submission.id}
            setVotesCount={setVotesCount} // Update votes count
          />
          <span>{votesCount} votes</span>
        </div>
      </div>
    </div>
  );
};

export default FullScreenSubmission;
