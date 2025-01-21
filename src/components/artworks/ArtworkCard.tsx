import { Heart, MessageCircle } from 'lucide-react';
import "../../css/artworks/artworkCard.css";

interface ArtworkCardProps {
  username: string;
  imagePath: string;

  loading?: 'lazy';
}

const ArtworkCard = ({ username, imagePath }: ArtworkCardProps) => {
  return (
    <div className="artwork-card">
      {/* Header */}
      <div className="artwork-card-header">
        @{username}
      </div>

      {/* Image */}
      <div className="artwork-image-container">
        <img 
        src={imagePath} 
        alt="Artwork" 
        className="artwork-image" 
        loading="lazy"/>
      </div>

      {/* Footer */}
      <div className="artwork-card-footer">
        <div className="icon-container">
          <Heart size={16} color="#fff" />
          <span className="icon-count">0</span>
        </div>
        <div className="icon-container">
          <MessageCircle size={16} color="#fff" />
          <span className="icon-count">0</span>
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;
