import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useContext } from "react";
import { X, MessageCircle, CircleUserRound } from "lucide-react";
import "../../css/artworks/fullScreenPost.css";
import { getProfileIdByUserId, getUserProfileByProfileId, fetchAvatarUrl } from "../../utils/api";
import { getAuthToken } from "../../utils/api"; // Import token helper
import { AuthContext } from "../../context/AuthContext"; // Import Auth Context
import Likes from "./Likes";
import Comments from "./Comments";
import { deletePost } from "../../utils/api/artworks";
function FullScreenPost({ post, onClose, onPostDeleted }) {
    const { auth } = useContext(AuthContext); // Get auth details
    const authToken = getAuthToken(); // Get token from local storage
    const [avatarUrl, setAvatarUrl] = useState(post.avatarUrl || "");
    const [likesCount, setLikesCount] = useState(post.likes_count);
    const [commentsCount, setCommentsCount] = useState(post.comments_count);
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
            }
            catch (error) {
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
            }
            else {
                console.error("onPostDeleted is not a function");
            }
            // Optionally close the fullscreen post view after deletion
            onClose();
            // Show a success alert
            alert("Post deleted successfully");
        }
        catch (error) {
            console.error("Error deleting post:", error);
        }
        finally {
            setIsDeleting(false); // Set deleting state to false after the request is done
        }
    };
    return (_jsxs("div", { className: "fullscreen-post", children: [_jsx("button", { className: "close-button", onClick: onClose, children: _jsx(X, { size: 36, color: "#e3e3e3" }) }), _jsxs("div", { className: "post-header", children: [avatarUrl ? (_jsx("img", { src: avatarUrl, alt: `${post.username}'s avatar`, className: "avatar" })) : (_jsx(CircleUserRound, { color: "#131313", size: 80 })), _jsxs("div", { children: [_jsx("p", { className: "username", children: post.username }), _jsxs("p", { className: "theme-name", children: ["Theme: ", post.themeName] })] })] }), _jsx("div", { className: "post-image", children: _jsx("img", { src: post.imageUrl, alt: "Post content" }) }), _jsxs("div", { className: "post-decription-delete-button", children: [post.description && (_jsx("div", { className: "fullpost-description", children: _jsx("p", { children: post.description }) })), isPostOwner && (_jsx("div", { className: "delete-post-container", children: _jsx("button", { className: "delete-post-button", onClick: handleDelete, disabled: isDeleting, children: isDeleting ? "Deleting..." : "Delete Post" }) }))] }), _jsxs("div", { className: "post-actions", children: [_jsxs("div", { className: "icon-container-full-post", style: { display: "flex", alignItems: "center" }, children: [_jsx(Likes, { postId: post.id, userId: post.userId, setLikesCount: setLikesCount }), _jsx("span", { className: "icon-count", children: likesCount })] }), _jsxs("div", { className: "icon-container-full-post", style: { display: "flex", alignItems: "center" }, children: [_jsx(MessageCircle, { size: 26, color: "#e3e3e3" }), _jsx("span", { className: "icon-count", children: commentsCount })] })] }), _jsx("div", { className: "comments-section", children: _jsx(Comments, { postId: post.id, userId: post.userId, setCommentsCount: setCommentsCount }) })] }));
}
export default FullScreenPost;
