import { Heart, MessageCircle } from "lucide-react";
import "../../css/postCard.css";

interface PostCardProps {
  username: string;
  image: string;
  likesCount: number;
  commentsCount: number;
  description: string;
}

const PostCard = ({ username, image, likesCount, commentsCount }: PostCardProps) => {
  return (
    <div className="artwork-card-dummy">
      {/* Artwork Header */}
      <div className="artwork-card-header-dummy">@{username}</div>

      {/* Artwork Image */}
      <div className="artwork-image-container-dummy">
        <img src={image} alt="Artwork" className="artwork-image-dummy" loading="lazy" />
      </div>

      {/* Artwork Footer with Like and Comment Count */}
      <div className="artwork-card-footer-dummy">
        <div className="icon-container-dummy">
          <Heart size={16} color="#fff" />
          <span className="icon-count">{likesCount}</span>
        </div>
        <div className="icon-container-dummy">
          <MessageCircle size={16} color="#fff" />
          <span className="icon-count">{commentsCount}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
