import { useState, useEffect, useContext } from "react";
import { X, MessageCircle, CircleUserRound } from "lucide-react";
import "../../css/artworks/fullScreenPost.css";
import { getProfileIdByUserId, getUserProfileByProfileId, fetchAvatarUrl } from "../../utils/api";
import { getAuthToken } from "../../utils/api"; // Import token helper
import { AuthContext } from "../../context/AuthContext"; // Import Auth Context
import Likes from "./Likes";
import Comments from "./Comments";
import { deletePost } from "../../utils/api/artworks";

interface Post {
  id: string;
  imageUrl: string;
  description: string;
  username: string;
  avatarUrl?: string;
  themeName: string;
  likes_count: number;
  comments_count: number;
  createdAt: string;
  userId: string;
}

type FullScreenPostProps = {
  post: Post;
  onClose: () => void;
  onPostDeleted: (postId: string) => void;
};

function FullScreenPost({ post, onClose, onPostDeleted }: FullScreenPostProps) {
  const { auth } = useContext(AuthContext); // Get auth details
  const authToken = getAuthToken(); // Get token from local storage
  const [avatarUrl, setAvatarUrl] = useState<string>(post.avatarUrl || "");
  const [likesCount, setLikesCount] = useState<number>(post.likes_count);
  const [commentsCount, setCommentsCount] = useState<number>(post.comments_count);
  const [isDeleting, setIsDeleting] = useState(false); // Track deletion state

  // Check if logged-in user is the post owner
  const isPostOwner = auth.id === post.userId;

  console.log("Auth Token:", authToken);
  console.log("Auth Context User ID:", auth.id);
  console.log("Post User ID:", post.userId);
  console.log("Is Post Owner:", isPostOwner);

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

  // Handle post deletion
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }
  
    try {
      setIsDeleting(true);
  
      // Call deletePost to delete the post
      const result = await deletePost(post.id);
      console.log(result);
  
      // Ensure onPostDeleted is a function before calling it
      if (typeof onPostDeleted === "function") {
        onPostDeleted(post.id); // Call the callback to remove the post
      } else {
        console.error("onPostDeleted is not a function");
      }
  
      // Optionally close the fullscreen post view after deletion
      onClose();
  
      // Show a success alert
      alert("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsDeleting(false); // Set deleting state to false after the request is done
    }
  };
  
  
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

      {/* Description & Delete Button */}
      <div className="post-decription-delete-button">
        {post.description && (
          <div className="fullpost-description">
            <p>{post.description}</p>
          </div>
        )}

        {/* Delete Button (Only for Post Owner) */}
        {isPostOwner && (
          <div className="delete-post-container">
            <button className="delete-post-button" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Post"}
            </button>
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="post-actions">
        <div className="icon-container-full-post" style={{ display: "flex", alignItems: "center" }}>
          <Likes postId={post.id} userId={post.userId} setLikesCount={setLikesCount} />
          <span className="icon-count">{likesCount}</span>
        </div>

        <div className="icon-container-full-post" style={{ display: "flex", alignItems: "center" }}>
          <MessageCircle size={26} color="#e3e3e3" />
          <span className="icon-count">{commentsCount}</span>
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <Comments postId={post.id} userId={post.userId} setCommentsCount={setCommentsCount} />
      </div>
    </div>
  );
}

export default FullScreenPost;
