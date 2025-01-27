import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { likePost, unlikePost, fetchLikes, checkIfUserLiked } from "../../utils/api/commentsLiks";
import { Like } from "../../utils/types";

type LikesProps = {
  postId: string;
  currentUserId: string;
  setLikesCount: React.Dispatch<React.SetStateAction<number>>; // Setter for likes count
};

function Likes({ postId, currentUserId, setLikesCount }: LikesProps) {
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [likes, setLikes] = useState<Like[]>([]);

  // Fetch likes and check if the current user has liked the post
  useEffect(() => {
    const loadLikes = async () => {
      try {
        // Use checkIfUserLiked to determine if the current user has liked the post
        const hasLiked = await checkIfUserLiked(postId);
        console.log("Has current user liked this post?", hasLiked);
        setUserHasLiked(hasLiked);

        // Fetch likes to set the likes count
        const fetchedLikes = await fetchLikes(postId);
        console.log("Fetched Likes: ", fetchedLikes);

        setLikesCount(fetchedLikes.length); // Update the likes count

        setLikes(fetchedLikes); // Set the likes state
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    loadLikes();
  }, [postId, currentUserId, setLikesCount]);

  // Handle like toggle logic
  const handleLikeToggle = async () => {
    try {
      console.log("User Has Liked Before Toggle: ", userHasLiked);

      if (userHasLiked) {
        // If user has liked the post, unlike it
        const userLike = likes.find((like) => like.user_id === currentUserId);
        if (userLike) {
          await unlikePost(postId, userLike.id);
          setLikes((prevLikes) => prevLikes.filter((like) => like.id !== userLike.id)); // Remove from likes list
        }
      } else {
        // If user hasn't liked the post, like it
        const newLike = await likePost(postId);
        setLikes((prevLikes) => [...prevLikes, newLike]); // Add new like to the list
      }

      // Toggle the user's like state and update the likes count accordingly
      setUserHasLiked((prev) => !prev);
      setLikesCount((prevCount) => userHasLiked ? prevCount - 1 : prevCount + 1); // Adjust likes count based on the new state
      console.log("User Has Liked After Toggle: ", !userHasLiked);
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
