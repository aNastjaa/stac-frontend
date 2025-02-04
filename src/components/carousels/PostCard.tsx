import { Heart, MessageCircle } from "lucide-react";

interface PostCardProps {
  username: string;
  image: string;
  description: string;
  likesCount: number;
  commentsCount: number;
}

const PostCard = ({ username, image, likesCount, commentsCount }: PostCardProps) => {
  return (
    <div className="artwork-card">
      {/* Artwork Header */}
      <div className="artwork-card-header">@{username}</div>

      {/* Artwork Image */}
      <div className="artwork-image-container">
        <img src={image} alt="Artwork" className="artwork-image" loading="lazy" />
      </div>

      {/* Artwork Footer with Like and Comment Count */}
      <div className="artwork-card-footer">
        <div className="icon-container">
          <Heart size={16} color="#fff" />
          <span className="icon-count">{likesCount}</span>
        </div>
        <div className="icon-container">
          <MessageCircle size={16} color="#fff" />
          <span className="icon-count">{commentsCount}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
