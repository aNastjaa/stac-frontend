import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getChallenges } from "../../utils/api/challenges";
import { fetchBrandLogoUrl } from "../../utils/api/admin";
import { ExternalLink, ImageOff } from "lucide-react";
import "../../css/challenges/sponsorChallenges.css";
import { ButtonPrimary } from "../../components/Buttons";
import FullScreenProUpgrade from "../../components/FullScreenProUpgrade";
const SponsorChallenges = () => {
    const [challenges, setChallenges] = useState([]);
    const [brandLogoUrls, setBrandLogoUrls] = useState({});
    const [role, setRole] = useState('');
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    useEffect(() => {
        // Get role from localStorage
        const storedUser = localStorage.getItem('auth_user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setRole(parsedUser.role_name || '');
        }
        const fetchChallengesAndLogos = async () => {
            try {
                const fetchedChallenges = await getChallenges();
                setChallenges(fetchedChallenges);
                const logoUrls = {};
                for (const challenge of fetchedChallenges) {
                    if (challenge.brand_logo_id) {
                        const logoUrl = await fetchBrandLogoUrl(challenge.brand_logo_id);
                        logoUrls[challenge.id] = logoUrl;
                    }
                }
                setBrandLogoUrls(logoUrls);
            }
            catch (error) {
                console.error("Error fetching challenges or logos:", error);
            }
        };
        fetchChallengesAndLogos();
    }, []);
    return (_jsxs("div", { className: "sponsor-challenges-container", children: [_jsxs("section", { className: "challenge-hero-section", children: [_jsx("h1", { children: "Ready to show your creativity?" }), _jsxs("p", { children: ["Join the exciting world of sponsored challenges! ", _jsx("br", {}), "Showcase your talent by submitting your creative works to top brands and win incredible prizes."] })] }), _jsx("div", { className: "challenge-how-it-works", children: _jsxs("p", { children: [_jsx("span", { className: "bite", children: "How It Works:" }), " ", _jsx("br", {}), " Brands create challenges and invite creators like you to submit your artwork. The more creative you get, the better your chances!"] }) }), role !== "pro" && (_jsxs("div", { className: "update-to-pro", children: [_jsxs("p", { children: [_jsx("span", { className: "bite", children: "Want to Participate?" }), " ", _jsx("br", {}), "You need to upgrade to a Pro account to submit your work and compete in these awesome challenges."] }), _jsxs("div", { className: "cta", children: [_jsx("p", { children: "Upgrade to Pro and start submitting your amazing creations today. Let your creativity shine!" }), _jsx(ButtonPrimary, { text: "Upgrade to Pro", onClick: () => setShowUpgradeModal(true) })] })] })), showUpgradeModal && _jsx(FullScreenProUpgrade, { onClose: () => setShowUpgradeModal(false) }), _jsxs("div", { className: "challenges-list", children: [_jsx("h2", { children: "Sponsored Challenges" }), challenges.map((challenge) => (_jsxs("div", { className: "challenge-item", children: [_jsx("div", { className: "brand-logo-container", children: challenge.brand_logo_id ? (_jsx("img", { src: brandLogoUrls[challenge.id] || "", alt: challenge.brand_name, className: "brand-logo" })) : (_jsx(ImageOff, { color: "#131313", size: 70 })) }), _jsxs(Link, { to: `/sponsor-challenges/${challenge.id}`, className: "challenge-content", children: [_jsxs("div", { className: "challenge-header", children: [_jsx("h3", { className: "brand-name", children: challenge.brand_name }), _jsx("h4", { className: "challenge-title", children: challenge.title })] }), _jsxs("div", { className: "challenge-footer", children: [_jsx("p", { className: "challenge-brief", children: challenge.brief }), _jsxs("p", { className: "deadline", children: ["Deadline: ", challenge.submission_deadline] }), _jsxs("span", { className: "view-challenge-link", children: ["View Challenge ", _jsx(ExternalLink, { size: 16 })] })] })] })] }, challenge.id)))] })] }));
};
export default SponsorChallenges;
