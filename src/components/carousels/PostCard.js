import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Heart, MessageCircle } from "lucide-react";
import "../../css/postCard.css";
const PostCard = ({ username, image, likesCount, commentsCount }) => {
    return (_jsxs("div", { className: "artwork-card-dummy", children: [_jsxs("div", { className: "artwork-card-header-dummy", children: ["@", username] }), _jsx("div", { className: "artwork-image-container-dummy", children: _jsx("img", { src: image, alt: "Artwork", className: "artwork-image-dummy", loading: "lazy" }) }), _jsxs("div", { className: "artwork-card-footer-dummy", children: [_jsxs("div", { className: "icon-container-dummy", children: [_jsx(Heart, { size: 16, color: "#fff" }), _jsx("span", { className: "icon-count", children: likesCount })] }), _jsxs("div", { className: "icon-container-dummy", children: [_jsx(MessageCircle, { size: 16, color: "#fff" }), _jsx("span", { className: "icon-count", children: commentsCount })] })] })] }));
};
export default PostCard;
