import { useState, useEffect } from "react";
import { fetchComments, createComment, deleteComment } from "../../utils/api/commentsLiks";
import { Comment } from "../../utils/types";
import { Send, Trash2 } from "lucide-react";

type CommentsProps = {
  postId: string;
  currentUserId: string;
  setCommentsCount: React.Dispatch<React.SetStateAction<number>>; // Add the setter for comment count
};

function Comments({ postId, currentUserId, setCommentsCount }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState("");

  useEffect(() => {
    const loadComments = async () => {
      try {
        const fetchedComments = await fetchComments(postId);
        setComments(fetchedComments);
        setCommentsCount(fetchedComments.length); // Set the initial comment count
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    loadComments();
  }, [postId, setCommentsCount]);

  const handleAddComment = async () => {
    if (!newCommentText.trim()) return;

    try {
      const newComment = await createComment(postId, newCommentText);
      setComments((prevComments) => {
        const updatedComments = [...prevComments, newComment];
        setCommentsCount(updatedComments.length); // Update the comment count
        return updatedComments;
      });
      setNewCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(postId, commentId);
      setComments((prevComments) => {
        const updatedComments = prevComments.filter((comment) => comment.id !== commentId);
        setCommentsCount(updatedComments.length); // Update the comment count
        return updatedComments;
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="comments-container">
      <ul className="comments-list">
        {comments.map((comment) => (
          <li key={comment.id}>
            <div className="comment">
              <strong>{comment.user.username}:</strong> {comment.comment_text}

              {/* Show Trash2 icon next to the comment if it belongs to the current user */}
              {comment.user_id === currentUserId && (
                <button
                  className="delete-button"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  <Trash2 size={18} color="red" />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="comment-input">
        <input
          type="text"
          placeholder="Write a comment..."
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
        />
        <button onClick={handleAddComment}>
          <Send size={24} color="#e3e3e3" />
        </button>
      </div>
    </div>
  );
}

export default Comments;
