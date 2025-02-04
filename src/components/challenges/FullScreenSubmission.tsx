import { useState, useEffect } from "react";
import { X, CircleUserRound } from "lucide-react";
import "../../css/challenges/fullScreenSubmission.css";
import { Submission } from "../../utils/types";
import { getProfileIdByUserId, getUserProfileByProfileId, fetchAvatarUrl } from "../../utils/api";
import VoteButton from "./VoteButton";

interface FullScreenSubmissionProps {
  submission: Submission;
  onClose: () => void;
  challengeName: string;
  votesCount: number;
}

const FullScreenSubmission = ({ submission, onClose, challengeName, votesCount: initialVotesCount }: FullScreenSubmissionProps) => {
  const [avatarUrl, setAvatarUrl] = useState<string>(submission.user.avatar_url || "");
  const [votesCount, setVotesCount] = useState<number>(initialVotesCount);

  // Fetch avatar logic
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

  return (
    <div className="fullscreen-post">
      {/* Close Button */}
      <button className="close-button" onClick={onClose}>
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
          <p className="theme-name">Challenge: {challengeName}</p>
        </div>
      </div>
  
      {/* Submission Image */}
      <div className="post-image">
        <img src={submission.image_path} alt="Submission content" />
      </div>
  
      {/* Description Under Image */}
      {submission.description && (
        <div className="post-description">
          <p>{submission.description}</p>
        </div>
      )}
  
      {/* Submission Actions */}
      <div className="post-actions">
        <div className="icon-container-full-post">
          <VoteButton
            challengeId={submission.sponsor_challenge_id}
            submissionId={submission.id}
            setVotesCount={setVotesCount}
          />
          <span>{votesCount} votes</span>
        </div>
      </div>
    </div>
  );
};

export default FullScreenSubmission;
