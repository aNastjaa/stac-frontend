import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Flame } from "lucide-react";
import { voteForSubmission, removeVote, checkUserVote } from "../../utils/api/challenges";
import "../../css/challenges/voteButton.css";
function VoteButton({ challengeId, submissionId, setVotesCount }) {
    const [userHasVoted, setUserHasVoted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    useEffect(() => {
        const loadVoteStatus = async () => {
            try {
                const hasVoted = await checkUserVote(challengeId, submissionId);
                setUserHasVoted(hasVoted);
            }
            catch (error) {
                console.error("Error checking vote status:", error);
            }
        };
        loadVoteStatus();
    }, [challengeId, submissionId]);
    const handleVoteToggle = async () => {
        if (isProcessing)
            return; // Prevent multiple clicks
        setIsProcessing(true);
        try {
            if (userHasVoted) {
                await removeVote(challengeId, submissionId);
                setUserHasVoted(false);
                setVotesCount((prevCount) => prevCount - 1);
            }
            else {
                await voteForSubmission(challengeId, submissionId);
                setUserHasVoted(true);
                setVotesCount((prevCount) => prevCount + 1);
            }
        }
        catch (error) {
            console.error("Error toggling vote:", error);
        }
        finally {
            setIsProcessing(false);
        }
    };
    return (_jsx("div", { onClick: handleVoteToggle, style: { cursor: "pointer", fontSize: "26px" }, children: userHasVoted ? "🔥" : _jsx(Flame, { size: 26, color: "#e3e3e3", fill: "none" }) }));
}
export default VoteButton;
