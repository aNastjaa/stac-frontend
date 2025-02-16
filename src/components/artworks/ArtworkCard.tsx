import { useState, useEffect } from "react";
import { Heart, MessageCircle } from "lucide-react";
import "../../css/artworks/artworkCard.css";
import { fetchLikes, fetchComments, likePost, unlikePost } from "../../utils/api/commentsLiks";
import { ArtworkResponse, Like } from "../../utils/types";

interface ArtworkCardProps {
  artwork: ArtworkResponse;
  userId: string;
  isPending?: boolean;
  onClick?: () => void;
}

const ArtworkCard = ({ artwork, userId, isPending, onClick }: ArtworkCardProps) => {
  const [likesCount, setLikesCount] = useState<number>(0);
  const [commentsCount, setCommentsCount] = useState<number>(0);
  const [userHasLiked, setUserHasLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState<Like[]>([]);

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const fetchedLikes = await fetchLikes(artwork.id);
        setLikes(fetchedLikes);
        setLikesCount(fetchedLikes.length);

        const fetchedComments = await fetchComments(artwork.id);
        setCommentsCount(fetchedComments.length);

        const hasLiked = fetchedLikes.some((like) => like.user_id === userId);
        setUserHasLiked(hasLiked);
      } catch (error) {
        console.error("Error fetching likes/comments:", error);
      }
    };

    loadCounts();
  }, [artwork.id, userId]);

  const handleLikeToggle = async () => {
    if (artwork.status === "pending") return; // Disable like toggle for pending posts

    try {
      if (userHasLiked) {
        const likeToRemove = likes.find((like) => like.user_id === userId);
        if (likeToRemove) {
          await unlikePost(artwork.id, likeToRemove.id);
          setLikesCount((prev) => prev - 1);
          setLikes((prev) => prev.filter((like) => like.id !== likeToRemove.id));
        }
      } else {
        const newLike = await likePost(artwork.id);
        setLikesCount((prev) => prev + 1);
        setLikes((prev) => [...prev, newLike]);
      }
      setUserHasLiked((prev) => !prev);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    if (artwork.status === "pending") {
      e.preventDefault(); // Disable comment button for pending posts
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (artwork.status === "pending") {
      e.preventDefault(); // Disable navigation for pending posts
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div className={`artwork-card ${isPending ? "blurred" : ""}`} onClick={handleClick}>
      {/* Artwork Header */}
      <div className="artwork-card-header">@{artwork.user.username}</div>

      {/* Artwork Image */}
      <div className="artwork-image-container">
        <img src={artwork.image_path} alt="Artwork" className="artwork-image" loading="lazy" />
      </div>

      {/* Artwork Footer with Like and Comment Count */}
      <div className="artwork-card-footer">
        {/* Conditionally render like button */}
        {artwork.status !== "pending" && (
          <div className="icon-container" onClick={handleLikeToggle}>
           <Heart
              size={16}
              color={userHasLiked ? "red" : "#fff"}
              fill={userHasLiked ? "red" : "none"}
            />
            <span className="icon-count">{likesCount}</span>
          </div>
        )}

        {/* Conditionally render comment button */}
        {artwork.status !== "pending" && (
          <div className="icon-container" onClick={handleCommentClick}>
            <MessageCircle size={16} color="#fff" />
            <span className="icon-count">{commentsCount}</span>
          </div>
        )}
      </div>

      {/* Approval Overlay for Pending Artworks */}
      {isPending && <div className="approval-overlay">Waiting to be approved</div>}
    </div>
  );
};

export default ArtworkCard;
