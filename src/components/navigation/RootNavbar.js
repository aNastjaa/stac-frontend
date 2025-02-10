import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Menu } from "lucide-react";
import "../../css/rootNavigation.css";
import RootNavigation from "../navigation/RootNavigation";
function RootNavbar({ isDarkMode }) {
    const [isOpen, setIsOpen] = useState(false);
    // Toggle the menu
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    return (_jsxs("nav", { className: `navbar ${isDarkMode ? "dark" : "light"}`, children: [_jsxs("div", { className: "nav-content", children: [_jsx("div", { className: "logo-navbar", children: "stac" }), _jsx("div", { className: "menu-icon", onClick: toggleMenu, children: _jsx(Menu, { size: 40, color: isDarkMode ? "#e3e3e3" : "#131313" }) })] }), isOpen && _jsx(RootNavigation, { isOpen: isOpen, closeMenu: toggleMenu, isDarkMode: isDarkMode })] }));
}
export default RootNavbar;
