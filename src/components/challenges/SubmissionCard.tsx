import { useEffect, useState } from "react";
import { Submission, Vote } from "../../utils/types";
import VoteButton from "../../components/challenges/VoteButton";
import "../../css/challenges/submissionCard.css";

interface SubmissionCardProps {
  submission: Submission & { votes?: Vote[] };
  isPending?: boolean; // New prop for pending status
  onClick?: () => void;
}

const SubmissionCard = ({ submission, isPending, onClick }: SubmissionCardProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);
  const [votesCount, setVotesCount] = useState<number>(
    submission.votes ? Math.max(submission.votes.length, 1) : 1
  );

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
      <div className="submission-image-container">
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
    </div>
  );
};

export default SubmissionCard;
