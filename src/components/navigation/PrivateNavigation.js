import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X } from "lucide-react"; // Close icon
import { useLocation } from "react-router-dom"; // Hook to get current location
import { useState, useEffect } from "react"; // For handling state and side-effects
import { Link } from "react-router-dom"; 

function PrivateNavigation({ isOpen, closeMenu }) {
    const location = useLocation(); // Get the current location
    const [activeLink, setActiveLink] = useState(location.pathname);
    const [isAdmin, setIsAdmin] = useState(false); // State to track admin role
    useEffect(() => {
        // Check if user is an admin from localStorage or context
        const storedUser = localStorage.getItem("auth_user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.role_name === "admin") {
                setIsAdmin(true); // If admin role, set isAdmin to true
            }
        }
        setActiveLink(location.pathname); // Update active link on route change
    }, [location]);
    const handleLinkClick = (link) => {
        setActiveLink(link); // Update active link when clicked
        closeMenu(); // Close the menu
    };
    return (_jsx("div", { className: `private-navigation-menu ${isOpen ? "open" : ""}`, children: _jsxs("div", { className: "private-menu-content", children: [_jsxs("div", { className: "nav-menu-content", children: [_jsx("div", { className: "logo", children: "stac" }), _jsx("button", { className: "close-btn", onClick: closeMenu, children: _jsx(X, { size: 40, color: "#e3e3e3" }) })] }), _jsx("nav", { children: _jsxs("ul", { children: [_jsx("li", { children: _jsx(Link, { to: "/artworks", className: activeLink === "/artworks" ? "active" : "", onClick: () => handleLinkClick("/artworks"), children: "Artworks" }) }), _jsx("li", { children: _jsx(Link, { to: "/sponsor-challenges", className: activeLink === "/sponsor-challenges" ? "active" : "", onClick: () => handleLinkClick("/sponsor-challenges"), children: "Challenges" }) }), _jsx("li", { children: _jsx(Link, { to: "/profile", className: activeLink === "/profile" ? "active" : "", onClick: () => handleLinkClick("/profile"), children: "Profile" }) }), isAdmin && (_jsx("li", { children: _jsx(Link, { to: "/admin/dashboard", className: activeLink === "/admin/dashboard" ? "active" : "", onClick: () => handleLinkClick("/admin/dashboard"), children: "Admin Dashboard" }) }))] }) })] }) }));
}
export default PrivateNavigation;
