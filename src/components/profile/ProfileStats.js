import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
const ProfileStats = ({ artworks }) => {
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
    return (_jsxs("div", { className: "profile-stats", children: [_jsxs("p", { children: [postsCount, " ", _jsx("br", {}), "Posts"] }), _jsxs("p", { children: [commentsCount, " ", _jsx("br", {}), "Comments"] }), _jsxs("p", { children: [likesCount, " ", _jsx("br", {}), "Likes"] })] }));
};
export default ProfileStats;
