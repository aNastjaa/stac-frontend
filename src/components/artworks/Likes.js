import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { likePost, unlikePost, fetchLikes } from "../../utils/api/commentsLiks";

function Likes({ postId, userId, setLikesCount }) {
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [likes, setLikes] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const loadLikes = async () => {
      try {
        const fetchedLikes = await fetchLikes(postId);
        setLikes(fetchedLikes);
        setLikesCount(fetchedLikes.length);

        // Check if the user has already liked the post
        const userLikeExists = fetchedLikes.some((like) => like.user_id === userId);
        setUserHasLiked(userLikeExists);
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
        // Find the user's like entry
        const userLike = likes.find((like) => like.user_id === userId);
        if (userLike) {
          await unlikePost(postId, userLike.id);
          setLikes((prevLikes) => prevLikes.filter((like) => like.id !== userLike.id));
          setLikesCount((prevCount) => prevCount - 1);
          setUserHasLiked(false);
        }
      } else {
        const newLike = await likePost(postId);
        setLikes((prevLikes) => [...prevLikes, newLike]);
        setLikesCount((prevCount) => prevCount + 1);
        setUserHasLiked(true);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return _jsx("div", {
    className: "likes-container",
    onClick: handleLikeToggle,
    style: { cursor: "pointer" },
    children: _jsx(Heart, {
      size: 26,
      color: userHasLiked ? "red" : "#e3e3e3",
      fill: userHasLiked ? "red" : "none",
    }),
  });
}

export default Likes;
