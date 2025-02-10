import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ButtonCTA } from "../../components/Buttons";
import ArtworkCarousel from "../../components/carousels/ArtworkCarousel"; // Import the ArtworkCarousel component
import "../../css/landingPage.css";
import { fetchArtworks } from "../../utils/api/artworks"; // Correct import for the API function
import SponsorChallengesCarousel from "../../components/carousels/SponsorChallengesCarousel";
const LandingPage = () => {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId] = useState("");
    const [isPending] = useState(false);
    useEffect(() => {
        // Fetch all artworks from the API or backend
        const getArtworks = async () => {
            try {
                setLoading(true);
                const fetchedArtworks = await fetchArtworks(); // Fetch artworks from the API
                // Filter out pending artworks before setting the state
                const approvedArtworks = fetchedArtworks.filter(artwork => artwork.status !== "pending");
                setArtworks(approvedArtworks); // Only set approved artworks
            }
            catch (error) {
                console.error("Error fetching artworks:", error);
                setError("Failed to load artworks.");
            }
            finally {
                setLoading(false);
            }
        };
        getArtworks();
    }, []);
    return (_jsxs("div", { className: "landing-page", children: [_jsxs("section", { className: "hero-section", children: [_jsxs("h1", { children: ["Welcome to ", _jsx("span", { className: "logo-text", children: "stac" })] }), _jsxs("p", { children: ["The ultimate platform ", _jsx("br", {}), "for artists and brands to connect and create"] }), _jsx(ButtonCTA, { text: "Get Started", link: "/register" }), " "] }), _jsxs("section", { className: "carousel-section", children: [_jsx("h3", { children: "Monthly theme:" }), _jsx("h2", { className: "bite", children: "\"Yellow color\"" }), loading ? (_jsx("p", { children: "Loading artworks..." })) : error ? (_jsx("p", { children: error })) : (_jsx(ArtworkCarousel, { artworks: artworks, userId: userId, isPending: isPending })), _jsx("div", { className: "submit-button-wrapper", children: _jsx(ButtonCTA, { text: "Submit", link: "/login" }) })] }), _jsxs("section", { className: "how-it-works", children: [_jsxs("h3", { children: ["How it works:", _jsx("br", {}), _jsx("span", { className: "headind-edition", children: "Create, showcase, and collaborate with artists worldwide." })] }), _jsxs("p", { children: [_jsx("span", { className: "bold", children: "\u2714\uFE0F Join the Community" }), _jsx("br", {}), "Sign Up for free and become part of a vibrant community of artists."] }), _jsxs("p", { children: [_jsx("span", { className: "bold", children: "\u2714\uFE0F Create for the Monthly Theme" }), _jsx("br", {}), "Submit your artwork inspired by the monthly theme and let your creativity shine."] }), _jsxs("p", { children: [_jsx("span", { className: "bold", children: "\u2714\uFE0F Collaborate with Brands " }), _jsx("br", {}), "Upgrade to Pro and participate in exclusive sponsor challenges to showcase your work to global brands."] })] }), _jsxs("section", { className: "user-comparison", children: [_jsxs("h3", { children: ["Basic User ", _jsx("span", { className: "vs", children: "vs" }), " Pro User"] }), _jsxs("div", { className: "comprasion", children: [_jsxs("div", { children: [_jsx("h4", { children: "Basic User Features:" }), _jsxs("ul", { children: [_jsx("li", { children: "- Access to all monthly themes." }), _jsx("li", { children: "-Showcase your work to the community." }), _jsx("li", { children: "-Engage with other artists: like, comment, and share." })] })] }), _jsxs("div", { children: [_jsx("h4", { children: "Pro User Features:" }), _jsxs("ul", { children: [_jsx("li", { children: "-Got all features from basic user" }), _jsx("li", { children: "-Participate in exclusive sponsor challenges" }), _jsx("li", { children: "-Get featured in brand collaborations" }), _jsx("li", { children: "-Add external links to your profile to share your portfolio." })] })] })] })] }), _jsx("div", { className: "ready-to-create-wrapper", children: _jsxs("section", { className: "ready-to-create", children: [_jsx("h2", { className: "bite", children: "Ready to create?" }), _jsx("h3", { children: "Join thousands of artists pushing creative boundaries every day. Sign up now and unleash your potential." }), _jsx(ButtonCTA, { text: "Join Now", link: "/register" })] }) }), _jsx("div", { className: "sponsors-section-wrapper", children: _jsxs("section", { className: "sponsors-section", children: [_jsx("h2", { className: "bite", children: "Sponsors" }), _jsx(SponsorChallengesCarousel, {})] }) })] }));
};
export default LandingPage;
