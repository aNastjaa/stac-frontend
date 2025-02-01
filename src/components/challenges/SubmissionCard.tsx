// import { useState, useEffect } from "react";
// import { ThumbsUp, MessageCircle } from "lucide-react"; // Change the icons for voting
// import "../../css/submissions/submissionCard.css"; // Adjust the CSS path as needed
// //import { fetchVotes, voteForSubmission, unvoteForSubmission } from "../../utils/api/votes"; // Adjust the imports if needed
// import { Submission} from "../../utils/types";

// interface SubmissionCardProps {
//   submission: Submission;
//   userId: string; // User ID to track votes
//   onClick?: () => void; // Optional click handler for the card
// }

// const SubmissionCard = ({ submission, userId, onClick }: SubmissionCardProps) => {
//   const [votesCount, setVotesCount] = useState<number>(0);
//   const [userHasVoted, setUserHasVoted] = useState<boolean>(false);
//   const [votes, setVotes] = useState<Vote[]>([]);

//   useEffect(() => {
//     const loadVotes = async () => {
//       try {
//         // Fetch votes count for the submission
//         const fetchedVotes = await fetchVotes(submission.id);
//         setVotes(fetchedVotes);
//         setVotesCount(fetchedVotes.length);

//         // Check if the user has voted on the submission
//         const hasVoted = fetchedVotes.some((vote) => vote.user_id === userId);
//         setUserHasVoted(hasVoted);
//       } catch (error) {
//         console.error("Error fetching votes:", error);
//       }
//     };

//     loadVotes();
//   }, [submission.id, userId]);

//   const handleVoteToggle = async () => {
//     try {
//       if (userHasVoted) {
//         // If the user has voted, remove their vote
//         const voteToRemove = votes.find((vote) => vote.user_id === userId);
//         if (voteToRemove) {
//           await unvoteForSubmission(submission.id, voteToRemove.id);
//           setVotesCount((prev) => prev - 1);
//           setVotes((prev) => prev.filter((vote) => vote.id !== voteToRemove.id));
//         }
//       } else {
//         // If the user hasn't voted, add their vote
//         const newVote = await voteForSubmission(submission.id);
//         setVotesCount((prev) => prev + 1);
//         setVotes((prev) => [...prev, newVote]);
//       }
//       setUserHasVoted((prev) => !prev); // Toggle vote status
//     } catch (error) {
//       console.error("Error toggling vote:", error);
//     }
//   };

//   return (
//     <div className="submission-card" onClick={onClick}>
//       {/* Submission Header */}
//       <div className="submission-card-header">
//         @{submission.user}
//       </div>

//       {/* Submission Image */}
//       <div className="submission-image-container">
//         <img
//           src={submission.image_path}
//           alt="Submission"
//           className="submission-image"
//           loading="lazy"
//         />
//       </div>

//       {/* Submission Footer with Vote Count */}
//       <div className="submission-card-footer">
//         {/* Votes Section */}
//         <div className="icon-container" onClick={handleVoteToggle}>
//           <ThumbsUp size={16} color={userHasVoted ? "green" : "#fff"} fill={userHasVoted ? "green" : "none"} />
//           <span className="icon-count">{votesCount}</span>
//         </div>

//         {/* Comments Section (if applicable) */}
//         <div className="icon-container">
//           <MessageCircle size={16} color="#fff" />
//           <span className="icon-count">0</span> {/* Update this with comment count logic if needed */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubmissionCard;
