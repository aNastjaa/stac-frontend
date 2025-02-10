import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { ButtonLong } from "../Buttons";
import { X } from "lucide-react";
import "../../css/landingPageMenu.css";
function RootNavigation({ isOpen, closeMenu }) {
    return (_jsxs("div", { className: `landing-page-menu ${isOpen ? "open" : ""}`, children: [_jsxs("div", { className: "menu-content", children: [_jsx(LinkIcon, { size: 150, color: "#E3E3E3", style: { opacity: 0.2 } }), _jsx("h1", { children: "Explore the app" }), _jsx("p", { children: "Now your creativity lives in one place\u2014 showcased, celebrated, and always evolving." }), _jsx("button", { className: "close-button", onClick: closeMenu, children: _jsx(X, { size: 40, color: "#E3E3E3" }) }), _jsx(Link, { to: "/register", onClick: closeMenu, children: _jsx(ButtonLong, { text: "Create Account" }) }), _jsx(Link, { to: "/login", onClick: closeMenu, children: _jsx(ButtonLong, { text: "Log In" }) })] }), _jsx("div", { className: "back-link", children: _jsx(Link, { to: "/", onClick: closeMenu, className: "back-to-start", children: "Back to start page" }) })] }));
}
export default RootNavigation;
