import { useState, useEffect } from "react";
import { fetchComments, createComment, deleteComment } from "../../utils/api/commentsLiks";
import { Comment } from "../../utils/types";
import { Send } from "lucide-react";

type CommentsProps = {
  postId: string;
  userId: string; // This is now used instead of currentUserId
  setCommentsCount: React.Dispatch<React.SetStateAction<number>>; // Add the setter for comment count
};

function Comments({ postId, userId, setCommentsCount }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false); // State to toggle showing all comments

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
    if (window.confirm("Are you sure you want to delete this comment?")) {
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
    }
  };

  return (
    <div className="comments-container">
      <ul className="comments-list">
        {comments.slice(0, showAllComments ? comments.length : 3).map((comment) => (
          <li key={comment.id}>
            <div className="comment">
              <strong>
                {comment.user?.username || "Loading comment..."}:
              </strong>{" "}
              {comment.comment_text}

              {/* Show delete button next to the comment if it belongs to the current user */}
              {comment.user_id === userId && (
                <button
                  className="delete-comment-button"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Show "Read more" button if there are more than 3 comments */}
      {comments.length > 3 && !showAllComments && (
        <button
          className="read-more-button"
          onClick={() => setShowAllComments(true)}
        >
          Read more
        </button>
      )}

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
