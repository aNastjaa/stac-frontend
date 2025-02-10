import { useEffect, useState } from 'react';
import { Submission, Vote } from '../../utils/types';
import VoteButton from '../../components/challenges/VoteButton';
import FullScreenSubmission from '../../components/challenges/FullScreenSubmission';
import '../../css/challenges/submissionCard.css';

interface SubmissionCardProps {
  submission: Submission & { votes?: Vote[] };
  isPending?: boolean;
  onClick?: () => void;
  challenge: string;
  onSubmissionDeleted: (submissionId: string) => void;
}

const SubmissionCard = ({ submission, isPending, onClick, challenge, onSubmissionDeleted }: SubmissionCardProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);
  const [votesCount, setVotesCount] = useState<number>(
    submission.votes ? Math.max(submission.votes.length, 1) : 1
  );
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setUsername(submission.user.username);
      setIsLoading(false);
    }, 1000);
  }, [submission.user.username]);

  const handleClick = (e: React.MouseEvent) => {
    if (isPending) {
      e.preventDefault();
    } else if (onClick) {
      onClick();
    }
  };

  const handleOpenFullscreen = () => {
    setIsFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
  };

  const handleSubmissionDeleted = (submissionId: string) => {
    console.log(`Submission with ID ${submissionId} deleted`);
    onSubmissionDeleted(submissionId); 
  };

  return (
    <div className={`submission-card ${isPending ? 'blurred' : ''}`} onClick={handleClick}>
      {/* Submission Header */}
      <div className="submission-card-header">
        {isLoading ? <span>Loading...</span> : `@${username}`}
      </div>

      {/* Submission Image */}
      <div className="submission-image-container" onClick={handleOpenFullscreen}>
        <img src={submission.image_path} alt="Submission" className="submission-image" loading="lazy" />
      </div>

      {/* Submission Footer (Vote Button & Count) */}
      <div className="submission-card-footer">
        {!isPending && (
          <div className="icon-container">
            <VoteButton
              challengeId={submission.challenge_id}
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
              challengeName={challenge}
              votesCount={votesCount}
              onSubmissionDeleted={handleSubmissionDeleted}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionCard;
