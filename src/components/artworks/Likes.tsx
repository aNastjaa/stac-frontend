import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { likePost, unlikePost, fetchLikes, checkIfUserLiked } from "../../utils/api/commentsLiks";

type LikesProps = {
  postId: string;
  userId: string;
  setLikesCount: React.Dispatch<React.SetStateAction<number>>;
};

function Likes({ postId, userId, setLikesCount }: LikesProps) {
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [likeId, setLikeId] = useState<string | null>(null); // Store user's like ID
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch likes and check if user has liked the post on mount
  useEffect(() => {
    const loadLikes = async () => {
      try {
        // Check if the user has liked the post
        const userLiked = await checkIfUserLiked(postId);
        setUserHasLiked(userLiked);

        // Fetching likes to update the likes count
        const fetchedLikes = await fetchLikes(postId);
        setLikesCount(fetchedLikes.length);

        // If the user liked the post, set the likeId
        const userLike = fetchedLikes.find((like) => like.user_id === userId);
        if (userLike) {
          setLikeId(userLike.id);
        } else {
          setLikeId(null);
        }
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    loadLikes();
  }, [postId, userId, setLikesCount]);

  // Handle like/unlike toggle
  const handleLikeToggle = async () => {
    if (!userId || isProcessing) return;
    setIsProcessing(true);

    try {
      if (likeId) {
        // Unlike the post if the user has already liked it
        await unlikePost(postId, likeId);
        setLikeId(null); // Clear likeId after unliking
        setUserHasLiked(false);
      } else {
        // Like the post if the user has not liked it yet
        const newLike = await likePost(postId);
        setLikeId(newLike.id); // Set the new likeId after liking
        setUserHasLiked(true);
      }

      // Refetch likes to update state
      const updatedLikes = await fetchLikes(postId);
      setLikesCount(updatedLikes.length);

      // Update userHasLiked based on the new like status
      setUserHasLiked(updatedLikes.some((like) => like.user_id === userId));
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="likes-container" onClick={handleLikeToggle} style={{ cursor: "pointer" }}>
      <Heart
        size={26}
        color={userHasLiked ? "red" : "#e3e3e3"} // Red if liked, default color if not
        fill={userHasLiked ? "red" : "none"} // Fill red if liked, transparent if not
      />
    </div>
  );
}

export default Likes;
