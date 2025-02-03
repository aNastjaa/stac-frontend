import { useEffect, useState } from "react";
import { Submission, Vote } from "../../utils/types";
import VoteButton from "../../components/challenges/VoteButton";
import "../../css/challenges/submissionCard.css";

interface SubmissionCardProps {
  submission: Submission & { votes?: Vote[] }; // Include optional votes array
  onClick?: () => void;
}

const SubmissionCard = ({ submission, onClick }: SubmissionCardProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);
  const [votesCount, setVotesCount] = useState<number>(
    submission.votes ? Math.max(submission.votes.length, 1) : 1
  );

  useEffect(() => {
    setIsLoading(true);

    // Simulate a short delay before showing the username
    setTimeout(() => {
      setUsername(submission.user.username);
      setIsLoading(false);
    }, 1000);

  }, [submission.user.username]);

  return (
    <div className="submission-card" onClick={onClick}>
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
        <div className="icon-container">
          <VoteButton
            challengeId={submission.sponsor_challenge_id}
            submissionId={submission.id}
            setVotesCount={setVotesCount} // Pass function to update count
          />
          <span className="icon-count">{votesCount} votes</span>
        </div>
      </div>
    </div>
  );
};

export default SubmissionCard;
