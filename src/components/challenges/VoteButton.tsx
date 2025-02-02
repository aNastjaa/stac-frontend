import { useState, useEffect } from "react";
import { Flame } from "lucide-react";
import { voteForSubmission, removeVote, checkUserVote } from "../../utils/api/challenges";
import "../../css/challenges/voteButton.css";
type VoteButtonProps = {
    challengeId: string;
    submissionId: string;
    setVotesCount: React.Dispatch<React.SetStateAction<number>>;
  };
  
  function VoteButton({ challengeId, submissionId, setVotesCount }: VoteButtonProps) {
    const [userHasVoted, setUserHasVoted] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
    useEffect(() => {
      const loadVoteStatus = async () => {
        try {
          const hasVoted = await checkUserVote(challengeId, submissionId);
          setUserHasVoted(hasVoted);
        } catch (error) {
          console.error("Error checking vote status:", error);
        }
      };
  
      loadVoteStatus();
    }, [challengeId, submissionId]);
  
    const handleVoteToggle = async () => {
      if (isProcessing) return; // Prevent multiple clicks
      setIsProcessing(true);
  
      try {
        if (userHasVoted) {
          await removeVote(challengeId, submissionId);
          setUserHasVoted(false);
          setVotesCount((prevCount) => prevCount - 1);
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
      <div onClick={handleVoteToggle} style={{ cursor: "pointer", fontSize: "26px" }}>
        {userHasVoted ? "🔥" : <Flame size={26} color="#e3e3e3" fill="none" />}
      </div>
    );
  }
  
  export default VoteButton;
