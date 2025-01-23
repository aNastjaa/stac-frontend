import { useState, useEffect } from 'react';
import { X, Heart, MessageCircle, Send, CircleUserRound } from 'lucide-react';
import '../../css/artworks/fullScreenPost.css';
import { 
  getProfileIdByUserId, 
  getUserProfileByProfileId, 
  fetchAvatarUrl 
} from '../../utils/api';

interface Comment {
  username: string;
  text: string;
}

interface Post {
  id: string;
  imageUrl: string;
  username: string;
  avatarUrl?: string;
  themeName: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
  userId: string;
}

type FullScreenPostProps = {
  post: Post;
  onClose: () => void;
};

function FullScreenPost({ post, onClose }: FullScreenPostProps) {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(post.comments);
  const [avatarUrl, setAvatarUrl] = useState<string>(post.avatarUrl || ''); // Use existing avatar if available

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        if (!avatarUrl && post.userId) {
          console.log('Fetching avatar for user ID:', post.userId);

          // Step 1: Fetch profile ID by user ID
          const profileId = await getProfileIdByUserId(post.userId);
          console.log('Fetched profile ID:', profileId);

          if (profileId) {
            // Step 2: Fetch user profile using profile ID
            const userProfile = await getUserProfileByProfileId(profileId);
            console.log('Fetched user profile:', userProfile);

            if (userProfile?.avatar_id) {
              // Step 3: Fetch avatar URL using avatar ID
              const fetchedAvatarUrl = await fetchAvatarUrl(userProfile.avatar_id);
              console.log('Fetched avatar URL:', fetchedAvatarUrl);

              if (fetchedAvatarUrl) {
                setAvatarUrl(fetchedAvatarUrl);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching avatar URL:', error);
      }
    };

    fetchAvatar();
  }, [avatarUrl, post.userId]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, { username: 'You', text: newComment }]);
      setNewComment('');
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

      {/* Post Actions */}
      <div className="post-actions">
        <div className="icon-container-full-post">
          <Heart size={26} color="#fff" />
          <span className="icon-count">{post.likes}</span>
        </div>
        <div className="icon-container-full-post">
          <MessageCircle size={26} color="#fff" />
          <span className="icon-count">{comments.length}</span>
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        {comments.length > 0 ? (
          <ul className="comments-list">
            {comments.map((comment, index) => (
              <li key={index}>
                <strong>{comment.username}:</strong> {comment.text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="placeholder">No comments yet. Be the first to comment!</p>
        )}

        {/* Comment Input */}
        <div className="comment-input">
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleAddComment}>
            <Send size={24} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FullScreenPost;
