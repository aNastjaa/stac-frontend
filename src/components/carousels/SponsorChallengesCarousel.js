import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import { getChallenges } from "../../utils/api/challenges";
import { fetchBrandLogoUrl } from "../../utils/api/admin"; // Already defined
import { ImageOff } from "lucide-react";
import "swiper/swiper-bundle.css";
import "../../css/sponsorCarousel.css"; // Ensure you have appropriate styles
const SponsorChallengesCarousel = () => {
    const [challenges, setChallenges] = useState([]);
    const [logoUrls, setLogoUrls] = useState({});
    useEffect(() => {
        const fetchChallengesAndLogos = async () => {
            try {
                // Fetch sponsor challenges
                const challengesData = await getChallenges();
                setChallenges(challengesData);
                // Fetch the brand logo URLs for each challenge
                const fetchedLogoUrls = {};
                for (const challenge of challengesData) {
                    if (challenge.brand_logo_id) {
                        const logoUrl = await fetchBrandLogoUrl(challenge.brand_logo_id);
                        fetchedLogoUrls[challenge.id] = logoUrl;
                    }
                }
                setLogoUrls(fetchedLogoUrls);
            }
            catch (error) {
                console.error("Failed to fetch sponsor challenges:", error);
            }
        };
        fetchChallengesAndLogos();
    }, []);
    return (_jsx("div", { className: "carousel-container", children: challenges.length > 0 ? (_jsx(Swiper, { effect: "cards", grabCursor: true, modules: [EffectCards], className: "sponsor-carousel", children: challenges.map((challenge) => (_jsx(SwiperSlide, { className: "challenge-slide", children: _jsx("div", { className: "challenge-item", children: _jsx("div", { className: "brand-logo-container", children: logoUrls[challenge.id] ? (_jsx("img", { src: logoUrls[challenge.id] || undefined, alt: challenge.brand_name, className: "brand-logo" })) : (_jsx(ImageOff, { color: "#131313", size: 70 })) }) }) }, challenge.id))) })) : (_jsx("p", { className: "no-challenges", children: "No sponsor challenges available." })) }));
};
export default SponsorChallengesCarousel;
