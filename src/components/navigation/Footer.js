import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "../../css/footer.css";
const Footer = ({ isDarkMode }) => {
    return (_jsx("div", { className: "footer-wraper", children: _jsxs("footer", { className: `footer ${isDarkMode ? "dark" : "light"}`, children: [" ", _jsxs("div", { className: "footer-content", children: [_jsxs("div", { className: "footer-text", children: [_jsx("span", { className: "footer-logo", children: "stac" }), _jsx("p", { className: "footer-tagline", children: "SHOWCASE OF THEMATIC ART CREATIONS" })] }), _jsxs("div", { className: "footer-links", children: [_jsx("p", { children: "support@stac.com" }), _jsx("p", { children: "\u00A9 STAC 2025" })] }), _jsxs("div", { className: "footer-nav", children: [_jsx("a", { href: "#", children: "FAQ |" }), " ", _jsx("a", { href: "#", children: "Privacy Policy |" }), " ", _jsx("a", { href: "#", children: "Terms of Service" })] })] })] }) }));
};
export default Footer;
