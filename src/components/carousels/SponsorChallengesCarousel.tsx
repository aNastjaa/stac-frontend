import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import { getChallenges } from "../../utils/api/challenges";
import { fetchBrandLogoUrl } from "../../utils/api/admin"; // Already defined
import { SponsorChallenge } from "../../utils/types";
import { ImageOff } from "lucide-react";

import "swiper/swiper-bundle.css";
import "../../css/sponsorCarousel.css"; // Ensure you have appropriate styles

const SponsorChallengesCarousel = () => {
  const [challenges, setChallenges] = useState<SponsorChallenge[]>([]);
  const [logoUrls, setLogoUrls] = useState<{ [key: string]: string | null }>({});

  useEffect(() => {
    const fetchChallengesAndLogos = async () => {
      try {
        // Fetch sponsor challenges
        const challengesData = await getChallenges();
        setChallenges(challengesData);

        // Fetch the brand logo URLs for each challenge
        const fetchedLogoUrls: { [key: string]: string | null } = {};

        for (const challenge of challengesData) {
          if (challenge.brand_logo_id) {
            const logoUrl = await fetchBrandLogoUrl(challenge.brand_logo_id);
            fetchedLogoUrls[challenge.id] = logoUrl;
          }
        }

        setLogoUrls(fetchedLogoUrls);
      } catch (error) {
        console.error("Failed to fetch sponsor challenges:", error);
      }
    };

    fetchChallengesAndLogos();
  }, []);

  return (
    <div className="carousel-container">
      {challenges.length > 0 ? (
        <Swiper effect="cards" grabCursor modules={[EffectCards]} className="sponsor-carousel">
          {challenges.map((challenge) => (
            <SwiperSlide key={challenge.id} className="challenge-slide">
              <div className="challenge-item">
                {/* Brand Logo */}
                <div className="brand-logo-container">
                  {logoUrls[challenge.id] ? (
                    <img 
                    src={logoUrls[challenge.id] || undefined} 
                    alt={challenge.brand_name} 
                    className="brand-logo" 
                  />
                  ) : (
                    <ImageOff color="#131313" size={70} />
                  )}
                </div>

                {/* Challenge Details */}
                {/* <h3 className="challenge-title">{challenge.title}</h3> */}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="no-challenges">No sponsor challenges available.</p>
      )}
    </div>
  );
};

export default SponsorChallengesCarousel;
