import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Heart, MessageCircle } from "lucide-react";
import "../../css/artworks/artworkCard.css";
import { fetchLikes, fetchComments, likePost, unlikePost } from "../../utils/api/commentsLiks";
const ArtworkCard = ({ artwork, userId, isPending, onClick }) => {
    const [likesCount, setLikesCount] = useState(0);
    const [commentsCount, setCommentsCount] = useState(0);
    const [userHasLiked, setUserHasLiked] = useState(false);
    const [likes, setLikes] = useState([]);
    useEffect(() => {
        const loadCounts = async () => {
            try {
                const fetchedLikes = await fetchLikes(artwork.id);
                setLikes(fetchedLikes);
                setLikesCount(fetchedLikes.length);
                const fetchedComments = await fetchComments(artwork.id);
                setCommentsCount(fetchedComments.length);
                const hasLiked = fetchedLikes.some((like) => like.user_id === userId);
                setUserHasLiked(hasLiked);
            }
            catch (error) {
                console.error("Error fetching likes/comments:", error);
            }
        };
        loadCounts();
    }, [artwork.id, userId]);
    const handleLikeToggle = async () => {
        if (artwork.status === "pending")
            return; // Disable like toggle for pending posts
        try {
            if (userHasLiked) {
                const likeToRemove = likes.find((like) => like.user_id === userId);
                if (likeToRemove) {
                    await unlikePost(artwork.id, likeToRemove.id);
                    setLikesCount((prev) => prev - 1);
                    setLikes((prev) => prev.filter((like) => like.id !== likeToRemove.id));
                }
            }
            else {
                const newLike = await likePost(artwork.id);
                setLikesCount((prev) => prev + 1);
                setLikes((prev) => [...prev, newLike]);
            }
            setUserHasLiked((prev) => !prev);
        }
        catch (error) {
            console.error("Error toggling like:", error);
        }
    };
    const handleCommentClick = (e) => {
        if (artwork.status === "pending") {
            e.preventDefault(); // Disable comment button for pending posts
        }
    };
    const handleClick = (e) => {
        if (artwork.status === "pending") {
            e.preventDefault(); // Disable navigation for pending posts
        }
        else if (onClick) {
            onClick();
        }
    };
    return (_jsxs("div", { className: `artwork-card ${isPending ? "blurred" : ""}`, onClick: handleClick, children: [_jsxs("div", { className: "artwork-card-header", children: ["@", artwork.user.username] }), _jsx("div", { className: "artwork-image-container", children: _jsx("img", { src: artwork.image_path, alt: "Artwork", className: "artwork-image", loading: "lazy" }) }), _jsxs("div", { className: "artwork-card-footer", children: [artwork.status !== "pending" && (_jsxs("div", { className: "icon-container", onClick: handleLikeToggle, children: [_jsx(Heart, { size: 16, color: userHasLiked ? "red" : "#fff", fill: userHasLiked ? "red" : "none" }), _jsx("span", { className: "icon-count", children: likesCount })] })), artwork.status !== "pending" && (_jsxs("div", { className: "icon-container", onClick: handleCommentClick, children: [_jsx(MessageCircle, { size: 16, color: "#fff" }), _jsx("span", { className: "icon-count", children: commentsCount })] }))] }), isPending && _jsx("div", { className: "approval-overlay", children: "Waiting to be approved" })] }));
};
export default ArtworkCard;
