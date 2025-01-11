import { ButtonCTA } from "../../components/Buttons";
import Carousel1 from "../../components/Carousel1";
import SponsorCarousel from "../../components/SponsorCarousel";
//import SponsorCarousel from "../../components/SponsorCarousel";
import "../../css/landingPage.css";

const LandingPage = () => {
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
        <h2 className="bite">"Beyond the Horizon"</h2>
        <Carousel1 />
        <ButtonCTA text="Submit" link="/login" />
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h3>How it works:<br />
          <span className="headind-edition">Create, showcase, and collaborate with artists worldwide.</span></h3>
          <p>✔️ Join the Community
              Sign Up for free and become part of a vibrant community of artists.
          </p>
          <p>
              ✔️ Create for the Monthly Theme
              Submit your artwork inspired by the monthly theme and let your creativity shine.
          </p>
          <p>
              ✔️ Collaborate with Brands 
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
