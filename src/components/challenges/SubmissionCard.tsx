import { useEffect, useState } from "react";
import { Submission, Vote } from "../../utils/types";
import VoteButton from "../../components/challenges/VoteButton";
import FullScreenSubmission from "../../components/challenges/FullScreenSubmission";
import "../../css/challenges/submissionCard.css";

interface SubmissionCardProps {
  submission: Submission & { votes?: Vote[] };
  isPending?: boolean; // New prop for pending status
  onClick?: () => void;
  challengeName: string; // Add challengeName prop
}

const SubmissionCard = ({ submission, isPending, onClick, challengeName }: SubmissionCardProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);
  const [votesCount, setVotesCount] = useState<number>(
    submission.votes ? Math.max(submission.votes.length, 1) : 1
  );
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false); // State to toggle fullscreen

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setUsername(submission.user.username);
      setIsLoading(false);
    }, 1000);
  }, [submission.user.username]);

  // Handle click to prevent interaction if submission is pending
  const handleClick = (e: React.MouseEvent) => {
    if (isPending) {
      e.preventDefault(); // Prevent any interaction if pending
    } else if (onClick) {
      onClick();
    }
  };

  const handleOpenFullscreen = () => {
    setIsFullscreen(true); // Open FullScreen view
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false); // Close FullScreen view
  };

  return (
    <div 
      className={`submission-card ${isPending ? "blurred" : ""}`} 
      onClick={handleClick}
    >
      {/* Submission Header */}
      <div className="submission-card-header">
        {isLoading ? <span>Loading...</span> : `@${username}`}
      </div>

      {/* Submission Image */}
      <div className="submission-image-container" onClick={handleOpenFullscreen}>
        <img
          src={submission.image_path}
          alt="Submission"
          className="submission-image"
          loading="lazy"
        />
      </div>

      {/* Submission Footer (Vote Button & Count) */}
      <div className="submission-card-footer">
        {/* Conditionally render vote button if submission is not pending */}
        {!isPending && (
          <div className="icon-container">
            <VoteButton
              challengeId={submission.sponsor_challenge_id}
              submissionId={submission.id}
              setVotesCount={setVotesCount}
            />
            <span className="icon-count">{votesCount} votes</span>
          </div>
        )}
      </div>

      {/* Approval Overlay for Pending Submissions */}
      {isPending && <div className="approval-overlay">Waiting to be approved</div>}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fullscreen-modal-overlay" onClick={handleCloseFullscreen}>
          <div className="fullscreen-modal-content" onClick={(e) => e.stopPropagation()}>
            <FullScreenSubmission
              submission={submission}
              onClose={handleCloseFullscreen}
              challengeName={challengeName}
              votesCount={votesCount}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionCard;
