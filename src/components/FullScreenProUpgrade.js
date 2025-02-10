import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import "../css/fullScreenProUpgrade.css";
import { ButtonLong } from "./Buttons";
export default function FullScreenProUpgrade({ onClose }) {
    useEffect(() => {
        // Prevent scrolling when modal is open
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);
    return (_jsx("div", { className: "fullscreen-overlay", children: _jsxs("div", { className: "upgrade-container", children: [_jsx("button", { className: "close-button", onClick: onClose, children: "\u00D7" }), _jsx("h2", { className: "upgrade-title", children: "Unlock your full potential" }), _jsx("p", { className: "upgrade-subtitle", children: "Upgrade to Pro and take your creativity to the next level!" }), _jsxs("section", { className: "user-comparison-wrapper", children: [_jsxs("h3", { children: ["Basic User ", _jsx("span", { className: "vs", children: "vs" }), " Pro User"] }), _jsxs("div", { className: "comparison-grid", children: [_jsxs("div", { className: "comparison-box basic", children: [_jsx("h4", { children: "Basic User Features:" }), _jsxs("ul", { children: [_jsx("li", { children: "\u2705 Access all monthly themes" }), _jsx("li", { children: "\u2705 Showcase your work to the community" }), _jsx("li", { children: "\u2705 Engage with other artists: like, comment, and share" })] })] }), _jsxs("div", { className: "comparison-box pro", children: [_jsx("h4", { children: "Pro User Features:" }), _jsxs("ul", { children: [_jsx("li", { children: "\uD83D\uDD25 Includes all Basic features" }), _jsx("li", { children: "\uD83D\uDD25 Participate in exclusive sponsor challenges" }), _jsx("li", { children: "\uD83D\uDD25 Get featured in brand collaborations" }), _jsx("li", { children: "\uD83D\uDD25 Add external links to your profile & share your portfolio" })] })] })] })] }), _jsxs("div", { className: "pricing-section", children: [_jsxs("p", { className: "pricing-text", children: [_jsx("strong", { children: "Only \u20AC10/month" }), " or ", _jsx("strong", { children: "\u20AC100/year" }), " for unlimited Pro benefits!"] }), _jsx(ButtonLong, { text: "Become Pro now" })] })] }) }));
}
