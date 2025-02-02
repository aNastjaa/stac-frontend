import { useEffect, useState } from "react";
import { Submission } from "../../utils/types";
import VoteButton from "../../components/challenges/VoteButton";
import { getVotesCount } from "../../utils/api/challenges";
import "../../css/challenges/submissionCard.css";

interface SubmissionCardProps {
  submission: Submission;
  onClick?: () => void;
}

const SubmissionCard = ({ submission, onClick }: SubmissionCardProps) => {
  const [votesCount, setVotesCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true); // State for loading
  const [username, setUsername] = useState<string | null>(null); // State for username

  useEffect(() => {
    // Simulating a delay for the first render
    setIsLoading(true);
    
    // Assuming the username is already available on the submission object
    const fetchVotes = async () => {
      try {
        const count = await getVotesCount(submission.id);
        setVotesCount(count);
      } catch (error) {
        console.error("Error fetching votes:", error);
      }
    };

    // Set a timeout to simulate loading state for the first render
    setTimeout(() => {
      setUsername(submission.user.username); // Set the username after a delay (simulating API call)
      setIsLoading(false); // Set loading state to false once done
    }, 1000); // Adjust the timeout to suit your needs for loading duration

    fetchVotes();
  }, [submission.id, submission.user.username]); // Dependency array includes the username

  return (
    <div className="submission-card" onClick={onClick}>
      {/* Submission Header */}
      <div className="submission-card-header">
        {isLoading ? (
          <span>Loading...</span> // Show "Loading..." when the username is being fetched
        ) : (
          `@${username}` // Render the username when it's available
        )}
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
            setVotesCount={setVotesCount}
          />
          <span className="icon-count">{votesCount} votes</span>
        </div>
      </div>
    </div>
  );
};

export default SubmissionCard;
