import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { likePost, unlikePost, fetchLikes, checkIfUserLiked } from "../../utils/api/commentsLiks";
import { Like } from "../../utils/types";

type LikesProps = {
  postId: string;
  userId: string;
  setLikesCount: React.Dispatch<React.SetStateAction<number>>;
};

function Likes({ postId, userId, setLikesCount }: LikesProps) {
  const [userHasLiked, setUserHasLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState<Like[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // To prevent double clicks

  useEffect(() => {
    const loadLikes = async () => {
      try {
        const hasLiked = await checkIfUserLiked(postId);
        setUserHasLiked(hasLiked);

        const fetchedLikes = await fetchLikes(postId);
        setLikesCount(fetchedLikes.length);
        setLikes(fetchedLikes);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    loadLikes();
  }, [postId, userId, setLikesCount]);

  const handleLikeToggle = async () => {
    if (isProcessing) return; // Prevent multiple clicks
    setIsProcessing(true);

    try {
      if (userHasLiked) {
        const userLike = likes.find((like) => like.user_id === userId);
        if (userLike) {
          await unlikePost(postId, userLike.id);
          setLikes((prevLikes) => prevLikes.filter((like) => like.id !== userLike.id));
          setUserHasLiked(false);
          setLikesCount((prevCount) => prevCount - 1);
        }
      } else {
        const newLike = await likePost(postId);
        setLikes((prevLikes) => [...prevLikes, newLike]);
        setUserHasLiked(true);
        setLikesCount((prevCount) => prevCount + 1);
      }
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
        color={userHasLiked ? "red" : "#e3e3e3"}
        fill={userHasLiked ? "red" : "none"}
      />
    </div>
  );
}

export default Likes;
