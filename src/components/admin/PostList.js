import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { fetchPendingPosts, updatePostStatus } from '../../utils/api/admin';
import { ButtonPrimary } from '../Buttons';
import '../../css/admin_dashboard_styling/postList.css'; // Ensure this file exists
const PostList = () => {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const loadPosts = async () => {
            try {
                const fetchedPosts = await fetchPendingPosts();
                setPosts(fetchedPosts);
            }
            catch (error) {
                console.error('Failed to fetch posts', error);
            }
        };
        loadPosts();
    }, []);
    const handleStatusChange = async (postId, status) => {
        try {
            await updatePostStatus(postId, status); // Ensure types align
            setPosts(posts.filter((post) => post.id !== postId)); // Remove updated post
        }
        catch (error) {
            console.error('Failed to update post status', error);
        }
    };
    return (_jsxs("div", { className: 'post-list-container', children: [_jsx("h2", { children: "Pending Posts" }), _jsx("ul", { className: "post-list", children: posts.map((post) => (_jsxs("li", { className: "post-item", children: [_jsxs("div", { className: "post-details", children: [_jsxs("p", { className: "post-username", children: [" ", post.user, " "] }), post.image_path && (_jsx("div", { className: "thumbnail-container", children: _jsx("img", { src: post.image_path, alt: post.description, className: "thumbnail" }) })), _jsx("p", { children: post.description })] }), _jsxs("div", { className: "actions", children: [_jsx(ButtonPrimary, { onClick: () => handleStatusChange(post.id, 'accepted'), text: "Accept" }), _jsx(ButtonPrimary, { onClick: () => handleStatusChange(post.id, 'rejected'), text: "Reject" })] })] }, post.id))) })] }));
};
export default PostList;
