import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { likePost, unlikePost, fetchLikes } from "../../utils/api/commentsLiks";
import { Like } from "../../utils/types";

type LikesProps = {
  postId: string;
  currentUserId: string;
  setLikesCount: React.Dispatch<React.SetStateAction<number>>; // Add the setter for likes count
};

function Likes({ postId, currentUserId, setLikesCount }: LikesProps) {
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [likes, setLikes] = useState<Like[]>([]);

  // Fetch likes count when the component is mounted
  useEffect(() => {
    const loadLikes = async () => {
      try {
        const fetchedLikes = await fetchLikes(postId);
        setLikes(fetchedLikes);
        setLikesCount(fetchedLikes.length); // Set the initial like count
        setUserHasLiked(fetchedLikes.some((like) => like.user_id === currentUserId));
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    loadLikes();
  }, [postId, currentUserId, setLikesCount]);

  const handleLikeToggle = async () => {
    try {
      if (userHasLiked) {
        const userLike = likes.find((like) => like.user_id === currentUserId);
        if (userLike) {
          await unlikePost(postId, userLike.id);
          setLikes(likes.filter((like) => like.id !== userLike.id));
          setLikesCount((prevCount) => prevCount - 1); // Update like count after unliking
        }
      } else {
        const newLike = await likePost(postId);
        setLikes((prevLikes) => [...prevLikes, newLike]);
        setLikesCount((prevCount) => prevCount + 1); // Update like count after liking
      }

      setUserHasLiked(!userHasLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <div className="likes-container" onClick={handleLikeToggle} style={{ cursor: "pointer" }}>
      <Heart size={26} color={userHasLiked ? "red" : "#fff"} fill={userHasLiked ? "red" : "none"} />
    </div>
  );
}

export default Likes;
