import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import { getChallenges } from "../../utils/api/challenges"; 
import { fetchBrandLogoUrl } from "../../utils/api/admin"; 
import { SponsorChallenge } from "../../utils/types";
import { ExternalLink, ImageOff } from "lucide-react";
import "../../css/challenges/sponsorChallenges.css";
import { ButtonPrimary } from "../../components/Buttons";

const SponsorChallenges = () => {
  const [challenges, setChallenges] = useState<SponsorChallenge[]>([]);
  const [brandLogoUrls, setBrandLogoUrls] = useState<{ [key: string]: string | null }>({});
  const [role, setRole] = useState<string>(''); // Default to empty string

  useEffect(() => {
    // Get role from localStorage
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setRole(parsedUser.role_name || '');  // Set role from localStorage
    }

    const fetchChallengesAndLogos = async () => {
      try {
        const fetchedChallenges = await getChallenges();
        setChallenges(fetchedChallenges);

        const logoUrls: { [key: string]: string | null } = {};
        for (const challenge of fetchedChallenges) {
          if (challenge.brand_logo_id) {
            const logoUrl = await fetchBrandLogoUrl(challenge.brand_logo_id);
            logoUrls[challenge.id] = logoUrl;
          }
        }
        setBrandLogoUrls(logoUrls);
      } catch (error) {
        console.error("Error fetching challenges or logos:", error);
      }
    };

    fetchChallengesAndLogos();
  }, []);

  return (
    <div className="sponsor-challenges-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>Ready to Show Your Creativity?</h1>
        <p>
          Join the exciting world of sponsored challenges! <br />
          Showcase your talent by submitting your creative works to top brands and win incredible prizes.
        </p>
      </section>

      <div className="how-it-works">
        <p>
          <span className="bite">How It Works:</span> <br /> Brands create challenges and invite creators like you to submit your artwork. The more creative you get, the better your chances!
        </p>
      </div>

      {/* Conditionally render the "Want to Participate?" section based on the role */}
      {role !== 'pro' && (
        <div className="update-to-pro">
          <p>
            <span className="bite">Want to Participate?</span> <br />
            You need to upgrade to a Pro account to submit your work and compete in these awesome challenges.
          </p>
          <div className="cta">
            <p>
              Upgrade to Pro and start submitting your amazing creations today. Let your creativity shine!
            </p>
            <Link to="/upgrade-to-pro">
              <ButtonPrimary text="Upgrade to Pro" />
            </Link>
          </div>
        </div>
      )}

        {/* Challenges List */}
        <div className="challenges-list">
          <h2>Sponsored Challenges</h2>
          {challenges.map((challenge) => (
            <div key={challenge.id} className="challenge-item">
              {/* Brand Logo as background */}
              <div className="brand-logo-container">
                {challenge.brand_logo_id ? (
                  <img
                    src={brandLogoUrls[challenge.id] || ""}
                    alt={challenge.brand_name}
                    className="brand-logo"
                  />
                ) : (
                  <ImageOff color="#131313" size={70} />
                )}
              </div>

              {/* Content (Brand Name, Title, Brief) */}
              <div className="challenge-content">
                <div className="challenge-header">
                    {/* Brand Name (Upper Left Corner) */}
                    <h3 className="brand-name">{challenge.brand_name}</h3>

                    {/* Challenge Title */}
                    <h4 className="challenge-title">{challenge.title}</h4>
                </div>
                <div className="challenge-footer">
                    {/* Challenge Brief (Bottom of the Item) */}
                    <p className="challenge-brief">{challenge.brief}</p>
                    
                    {/* Deadline */}
                    <p className="deadline">Deadline: {challenge.submission_deadline}</p>

                    {/* View Challenge Link */}
                    <Link to={`/sponsor-challenges/${challenge.id}`} className="view-challenge-link">
                      View Challenge <ExternalLink size={16} />
                    </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
};

export default SponsorChallenges;
