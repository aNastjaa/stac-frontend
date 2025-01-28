import { useEffect, useState } from 'react';
import { ArtworkResponse } from '../../utils/types'; // Ensure this is correctly imported

interface ProfileStatsProps {
  artworks: ArtworkResponse[]; // Artworks passed as a prop
}

const ProfileStats = ({ artworks }: ProfileStatsProps) => {
  const [postsCount, setPostsCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (!artworks || artworks.length === 0) {
      // Reset stats if artworks is empty or undefined
      setPostsCount(0);
      setCommentsCount(0);
      setLikesCount(0);
      return;
    }

    // Calculate posts, comments, and likes safely
    const postCount = artworks.length;
    const totalComments = artworks.reduce((total, artwork) => total + (artwork.comments_count || 0), 0);
    const totalLikes = artworks.reduce((total, artwork) => total + (artwork.likes_count || 0), 0);

    // Update state with calculated values
    setPostsCount(postCount);
    setCommentsCount(totalComments);
    setLikesCount(totalLikes);
  }, [artworks]);

  return (
    <div className="profile-stats">
      <p>{postsCount} <br/>Posts</p>
      <p>{commentsCount} <br/>Comments</p>
      <p>{likesCount} <br/>Likes</p>
    </div>
  );
};

export default ProfileStats;
