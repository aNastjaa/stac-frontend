import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Menu } from "lucide-react"; // Burger menu icon from lucide-react
import { useState } from "react";
import PrivateNavigation from "./PrivateNavigation"; // Import PrivateNavigation component
import "../../css/privateNavigation.css";
function PrivateNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control the full-screen menu visibility
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen); // Toggle the full-screen menu
    };
    return (_jsxs("nav", { className: "navbar", children: [_jsxs("div", { className: "nav-content", children: [_jsx("div", { className: "logo-navbar", children: "stac" }), _jsxs("div", { className: "menu-icon", onClick: toggleMenu, children: [_jsx(Menu, { size: 40, color: "#131313" }), " "] })] }), _jsx(PrivateNavigation, { isOpen: isMenuOpen, closeMenu: toggleMenu })] }));
}
export default PrivateNavbar;
