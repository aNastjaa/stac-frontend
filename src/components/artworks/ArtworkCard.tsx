import { Heart, MessageCircle } from 'lucide-react';
import "../../css/artworks/artworkCard.css";
import { ArtworkResponse } from '../../utils/types';


interface ArtworkCardProps {
  artwork: ArtworkResponse; 
  onClick?: () => void;  
}

const ArtworkCard = ({ artwork, onClick }: ArtworkCardProps) => {
  const { username } = artwork.user;
  const imagePath = artwork.image_path;

  return (
    <div className="artwork-card" onClick={onClick}>
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
          <span className="icon-count">100500</span>
        </div>
        <div className="icon-container">
          <MessageCircle size={16} color="#fff" />
          <span className="icon-count">999</span>
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;
