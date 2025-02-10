import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { fetchComments, createComment, deleteComment } from "../../utils/api/commentsLiks";
import { Send } from "lucide-react";
function Comments({ postId, userId, setCommentsCount }) {
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState("");
    const [showAllComments, setShowAllComments] = useState(false); // State to toggle showing all comments
    useEffect(() => {
        const loadComments = async () => {
            try {
                const fetchedComments = await fetchComments(postId);
                setComments(fetchedComments);
                setCommentsCount(fetchedComments.length); // Set the initial comment count
            }
            catch (error) {
                console.error("Error fetching comments:", error);
            }
        };
        loadComments();
    }, [postId, setCommentsCount]);
    const handleAddComment = async () => {
        if (!newCommentText.trim())
            return;
        try {
            const newComment = await createComment(postId, newCommentText);
            setComments((prevComments) => {
                const updatedComments = [...prevComments, newComment];
                setCommentsCount(updatedComments.length); // Update the comment count
                return updatedComments;
            });
            setNewCommentText("");
        }
        catch (error) {
            console.error("Error adding comment:", error);
        }
    };
    const handleDeleteComment = async (commentId) => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            try {
                await deleteComment(postId, commentId);
                setComments((prevComments) => {
                    const updatedComments = prevComments.filter((comment) => comment.id !== commentId);
                    setCommentsCount(updatedComments.length); // Update the comment count
                    return updatedComments;
                });
            }
            catch (error) {
                console.error("Error deleting comment:", error);
            }
        }
    };
    return (_jsxs("div", { className: "comments-container", children: [_jsx("ul", { className: "comments-list", children: comments.slice(0, showAllComments ? comments.length : 3).map((comment) => (_jsx("li", { children: _jsxs("div", { className: "comment", children: [_jsxs("strong", { children: [comment.user?.username || "Loading comment...", ":"] }), " ", comment.comment_text, comment.user_id === userId && (_jsx("button", { className: "delete-comment-button", onClick: () => handleDeleteComment(comment.id), children: "delete" }))] }) }, comment.id))) }), comments.length > 3 && !showAllComments && (_jsx("button", { className: "read-more-button", onClick: () => setShowAllComments(true), children: "Read more" })), _jsxs("div", { className: "comment-input", children: [_jsx("input", { type: "text", placeholder: "Write a comment...", value: newCommentText, onChange: (e) => setNewCommentText(e.target.value) }), _jsx("button", { onClick: handleAddComment, children: _jsx(Send, { size: 24, color: "#e3e3e3" }) })] })] }));
}
export default Comments;
