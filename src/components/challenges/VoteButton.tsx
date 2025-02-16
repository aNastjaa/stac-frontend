import { useState, useEffect } from "react";
import { Flame } from "lucide-react";
import { voteForSubmission, removeVote, checkUserVote, getVotesCount } from "../../utils/api/challenges";
import "../../css/challenges/voteButton.css";

type VoteButtonProps = {
  challengeId: string;
  submissionId: string;
};

function VoteButton({ challengeId, submissionId }: VoteButtonProps) {
  const [userHasVoted, setUserHasVoted] = useState<boolean>(false);
  const [votesCount, setVotesCount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hasVoted = await checkUserVote(challengeId, submissionId);
        setUserHasVoted(hasVoted);

        const count = await getVotesCount(challengeId, submissionId);
        setVotesCount(count);
      } catch (error) {
        console.error("Error loading votes:", error);
      }
    };

    fetchData();
  }, [challengeId, submissionId]);

  const handleVoteToggle = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      if (userHasVoted) {
        await removeVote(challengeId, submissionId);
        setUserHasVoted(false);
        setVotesCount((prevCount) => Math.max(prevCount - 1, 0));
      } else {
        await voteForSubmission(challengeId, submissionId);
        setUserHasVoted(true);
        setVotesCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.error("Error toggling vote:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="icon-container">
      <div onClick={handleVoteToggle} style={{ cursor: "pointer", fontSize: "26px" }}>
        {userHasVoted ? "🔥" : <Flame size={26} color="#e3e3e3" fill="none" />}
      </div>
      <span className="icon-count">{votesCount} votes</span>
    </div>
  );
}

export default VoteButton;
