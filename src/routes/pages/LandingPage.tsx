import { useEffect, useState } from "react";
import { ButtonCTA } from "../../components/Buttons";
import ArtworkCarousel from "../../components/carousels/ArtworkCarousel"; // Import the ArtworkCarousel component
import SponsorCarousel from "../../components/SponsorCarousel";
import "../../css/landingPage.css";
import { fetchArtworks } from "../../utils/api/artworks";  // Correct import for the API function
import { ArtworkResponse } from "../../utils/types";  // Assuming this is your type for artwork

const LandingPage = () => {
  const [artworks, setArtworks] = useState<ArtworkResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId] = useState<string>("");
  const [isPending] = useState<boolean>(false);  

  useEffect(() => {
    // Fetch all artworks from the API or backend
    const getArtworks = async () => {
      try {
        setLoading(true);
        const fetchedArtworks = await fetchArtworks();  // Fetch artworks from the API

        // Filter out pending artworks before setting the state
        const approvedArtworks = fetchedArtworks.filter(artwork => artwork.status !== "pending");

        setArtworks(approvedArtworks); // Only set approved artworks
      } catch (error) {
        console.error("Error fetching artworks:", error);
        setError("Failed to load artworks.");
      } finally {
        setLoading(false);
      }
    };

    getArtworks();
  }, []);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>Welcome to <span className="logo-text">stac</span></h1>
        <p>The ultimate platform <br />
        for artists and brands to connect and create</p>
        <ButtonCTA text="Get Started" link="/register" /> {/* CTA Button */}
      </section>

      {/* Image Carousel Section */}
      <section className="carousel-section">
        <h3>Monthly theme:</h3>
        <h2 className="bite">"Yellow color"</h2>
        {loading ? (
          <p>Loading artworks...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ArtworkCarousel artworks={artworks} userId={userId} isPending={isPending} />
        )}
        <div className="submit-button-wrapper">
          <ButtonCTA text="Submit" link="/login" />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h3>How it works:<br />
          <span className="headind-edition">Create, showcase, and collaborate with artists worldwide.</span></h3>
          <p><span className="bold">✔️ Join the Community</span><br/>
               Sign Up for free and become part of a vibrant community of artists.
          </p>
          <p>
          <span className="bold">✔️ Create for the Monthly Theme</span><br/>
               Submit your artwork inspired by the monthly theme and let your creativity shine.
          </p>
          <p>
          <span className="bold">✔️ Collaborate with Brands </span><br/>
               Upgrade to Pro and participate in exclusive sponsor challenges to showcase your work to global brands.
          </p>
      </section>

      {/* Basic User vs Pro User */}
      <section className="user-comparison">
        <h3>Basic User <span className="vs">vs</span> Pro User</h3>
        <div className="comprasion">
          <div>
            <h4>Basic User Features:</h4>
            <ul>
            <li>- Access to all monthly themes.</li>
            <li>-Showcase your work to the community.</li>
            <li>-Engage with other artists: like, comment, and share.</li>
            </ul>
          </div>
          <div>
            <h4>Pro User Features:</h4>
            <ul>
              <li>-Got all features from basic user</li>
              <li>-Participate in exclusive sponsor challenges</li>
              <li>-Get featured in brand collaborations</li>
              <li>-Add external links to your profile to share your portfolio.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Ready to Create? */}
      <section className="ready-to-create">
        <h2 className="bite">Ready to create?</h2>
        <h3>Join thousands of artists pushing creative boundaries every day. 
        Sign up now and unleash your potential.</h3>
        <ButtonCTA text="Join Now" link="/register" />
      </section>

      {/* Sponsors Section (Carousel2) */}
      <section className="sponsors-section">
        <h2 className="bite">Sponsors</h2>
        <SponsorCarousel />
      </section>
    </div>
  );
};

export default LandingPage;
