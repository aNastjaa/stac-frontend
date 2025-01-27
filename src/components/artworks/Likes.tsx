import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { likePost, unlikePost, fetchLikes, checkIfUserLiked } from "../../utils/api/commentsLiks";
import { Like } from "../../utils/types";

type LikesProps = {
  postId: string;
  userId: string; // Using userId here instead of currentUserId
  setLikesCount: React.Dispatch<React.SetStateAction<number>>; // Setter for likes count
};

function Likes({ postId, userId, setLikesCount }: LikesProps) {
  const [userHasLiked, setUserHasLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState<Like[]>([]);

  useEffect(() => {
    const loadLikes = async () => {
      try {
        // Check if the current user has liked the post
        const hasLiked = await checkIfUserLiked(postId);
        setUserHasLiked(hasLiked);

        // Fetch the likes to update the likes count
        const fetchedLikes = await fetchLikes(postId);
        setLikesCount(fetchedLikes.length); // Update the likes count
        setLikes(fetchedLikes); // Update the likes state
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    loadLikes();
  }, [postId, userId, setLikesCount]); // Re-run the effect when postId or userId changes

  const handleLikeToggle = async () => {
    try {
      if (userHasLiked) {
        // If the user has liked the post, unlike it
        const userLike = likes.find((like) => like.user_id === userId);
        if (userLike) {
          await unlikePost(postId, userLike.id);
          setLikes((prevLikes) => prevLikes.filter((like) => like.id !== userLike.id)); // Remove the like
        }
      } else {
        // If the user hasn't liked the post, like it
        const newLike = await likePost(postId);
        setLikes((prevLikes) => [...prevLikes, newLike]); // Add the new like
      }

      // Toggle the like state and update the likes count
      setUserHasLiked((prev) => !prev);
      setLikesCount((prevCount) => userHasLiked ? prevCount - 1 : prevCount + 1); // Adjust likes count
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <div className="likes-container" onClick={handleLikeToggle} style={{ cursor: "pointer" }}>
      <Heart
        size={26}
        color={userHasLiked ? "red" : "#e3e3e3"}  // Red if liked, else default color
        fill={userHasLiked ? "red" : "none"}  // Fill heart if liked, else outline
      />
    </div>
  );
}

export default Likes;
