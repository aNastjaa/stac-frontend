import { useState, useEffect } from "react";
import { Heart, MessageCircle } from "lucide-react";
import "../../css/artworks/artworkCard.css";
import { fetchLikes, fetchComments, likePost, unlikePost } from "../../utils/api/commentsLiks"; // Add relevant imports
import { ArtworkResponse, Like } from "../../utils/types";

interface ArtworkCardProps {
  artwork: ArtworkResponse;
  userId: string; 
  onClick?: () => void;
}

const ArtworkCard = ({ artwork, userId, onClick }: ArtworkCardProps) => {
  const [likesCount, setLikesCount] = useState<number>(0);
  const [commentsCount, setCommentsCount] = useState<number>(0);
  const [userHasLiked, setUserHasLiked] = useState<boolean>(false); 
  const [likes, setLikes] = useState<Like[]>([]);

  useEffect(() => {
    // Fetch the likes and comments count when the artwork is loaded
    const loadCounts = async () => {
      try {
        // Fetch likes and comments count
        const fetchedLikes = await fetchLikes(artwork.id);
        setLikes(fetchedLikes);
        setLikesCount(fetchedLikes.length);

        const fetchedComments = await fetchComments(artwork.id);
        setCommentsCount(fetchedComments.length);

        // Check if the user has liked the post
        const hasLiked = fetchedLikes.some((like) => like.user_id === userId);
        setUserHasLiked(hasLiked);
      } catch (error) {
        console.error("Error fetching likes/comments:", error);
      }
    };

    loadCounts();
  }, [artwork.id, userId]);

  const handleLikeToggle = async () => {
    try {
      if (userHasLiked) {
        // If the user has liked, unlike it
        const likeToRemove = likes.find((like) => like.user_id === userId);
        if (likeToRemove) {
          await unlikePost(artwork.id, likeToRemove.id); // Pass both postId and likeId
          setLikesCount((prev) => prev - 1); // Decrease the like count
          setLikes((prev) => prev.filter((like) => like.id !== likeToRemove.id)); // Remove like from state
        }
      } else {
        // If the user hasn't liked, like it
        const newLike = await likePost(artwork.id); // Only postId needed
        setLikesCount((prev) => prev + 1); // Increase the like count
        setLikes((prev) => [...prev, newLike]); // Add the new like to state
      }
      setUserHasLiked((prev) => !prev); // Toggle like status
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <div className="artwork-card" onClick={onClick}>
      {/* Artwork Header */}
      <div className="artwork-card-header">
        @{artwork.user.username}
      </div>

      {/* Artwork Image */}
      <div className="artwork-image-container">
        <img
          src={artwork.image_path}
          alt="Artwork"
          className="artwork-image"
          loading="lazy"
        />
      </div>

      {/* Artwork Footer with Like and Comment Count */}
      <div className="artwork-card-footer">
        {/* Likes Section */}
        <div className="icon-container" onClick={handleLikeToggle}>
          <Heart size={16} color={userHasLiked ? "red" : "#fff"} fill={userHasLiked ? "red" : "none"} />
          <span className="icon-count">{likesCount}</span>
        </div>

        {/* Comments Section */}
        <div className="icon-container">
          <MessageCircle size={16} color="#fff" />
          <span className="icon-count">{commentsCount}</span>
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;
