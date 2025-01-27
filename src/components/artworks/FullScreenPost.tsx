import { useState, useEffect } from "react";
import { X, MessageCircle, CircleUserRound } from "lucide-react";
import "../../css/artworks/fullScreenPost.css";
import { getProfileIdByUserId, getUserProfileByProfileId, fetchAvatarUrl } from "../../utils/api";
import Likes from "./Likes";  // Import Likes Component
import Comments from "./Comments";  // Import Comments Component

interface Post {
  id: string;
  imageUrl: string;
  username: string;
  avatarUrl?: string;
  themeName: string;
  likes_count: number;
  comments_count: number;
  createdAt: string;
  userId: string;
}

type FullScreenPostProps = {
  post: Post; // Initial post data
  onClose: () => void;
  currentUserId: string;
};

function FullScreenPost({ post, onClose, currentUserId }: FullScreenPostProps) {
  const [avatarUrl, setAvatarUrl] = useState<string>(post.avatarUrl || "");
  const [likesCount, setLikesCount] = useState<number>(post.likes_count);
  const [commentsCount, setCommentsCount] = useState<number>(post.comments_count);

  // Fetch avatar logic
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        if (!avatarUrl && post.userId) {
          const profileId = await getProfileIdByUserId(post.userId);
          if (profileId) {
            const userProfile = await getUserProfileByProfileId(profileId);
            if (userProfile?.avatar_id) {
              const fetchedAvatarUrl = await fetchAvatarUrl(userProfile.avatar_id);
              if (fetchedAvatarUrl) {
                setAvatarUrl(fetchedAvatarUrl);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching avatar URL:", error);
      }
    };

    fetchAvatar();
  }, [avatarUrl, post.userId]);

  return (
    <div className="fullscreen-post">
      {/* Close Button */}
      <button className="close-button" onClick={onClose}>
        <X size={36} color="#e3e3e3" />
      </button>

      {/* Post Header */}
      <div className="post-header">
        {avatarUrl ? (
          <img src={avatarUrl} alt={`${post.username}'s avatar`} className="avatar" />
        ) : (
          <CircleUserRound color="#131313" size={80} />
        )}
        <div>
          <p className="username">{post.username}</p>
          <p className="theme-name">Theme: {post.themeName}</p>
        </div>
      </div>

      {/* Post Image */}
      <div className="post-image">
        <img src={post.imageUrl} alt="Post content" />
      </div>

      {/* Post Actions */}
      <div className="post-actions">
        {/* Likes */}
        <div className="icon-container-full-post" style={{ display: "flex", alignItems: "center" }}>
        <Likes
          postId={post.id}
          currentUserId={currentUserId}
          setLikesCount={setLikesCount}
        />
          <span className="icon-count">
            {likesCount}
          </span> {/* Display like count */}
        </div>

        {/* Comments */}
        <div className="icon-container-full-post" style={{ display: "flex", alignItems: "center" }}>
          <MessageCircle size={26} color="#e3e3e3" />
          <span className="icon-count">
            {commentsCount}
          </span> {/* Display comment count */}
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <Comments 
          postId={post.id} 
          currentUserId={currentUserId} 
          setCommentsCount={setCommentsCount} />
      </div>
    </div>
  );
}

export default FullScreenPost;
