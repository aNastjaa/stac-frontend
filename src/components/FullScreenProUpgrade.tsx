import { useEffect } from "react";
import "../css/fullScreenProUpgrade.css";
import { ButtonLong } from "./Buttons";

interface FullScreenProUpgradeProps {
  onClose: () => void;
}

export default function FullScreenProUpgrade({ onClose }: FullScreenProUpgradeProps) {
  useEffect(() => {
    // Prevent scrolling when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fullscreen-overlay">
      <div className="upgrade-container">
        {/* Close Button */}
        <button className="close-button" onClick={onClose}>&times;</button>

        {/* Header */}
        <h2 className="upgrade-title">Unlock your full potential</h2>
        <p className="upgrade-subtitle">Upgrade to Pro and take your creativity to the next level!</p>

        {/* Comparison Section */}
        <section className="user-comparison-wrapper">
          <h3>Basic User <span className="vs">vs</span> Pro User</h3>
          <div className="comparison-grid">
            {/* Basic User Features */}
            <div className="comparison-box basic">
              <h4>Basic User Features:</h4>
              <ul>
                <li>✅ Access all monthly themes</li>
                <li>✅ Showcase your work to the community</li>
                <li>✅ Engage with other artists: like, comment, and share</li>
              </ul>
            </div>

            {/* Pro User Features */}
            <div className="comparison-box pro">
              <h4>Pro User Features:</h4>
              <ul>
                <li>🔥 Includes all Basic features</li>
                <li>🔥 Participate in exclusive sponsor challenges</li>
                <li>🔥 Get featured in brand collaborations</li>
                <li>🔥 Add external links to your profile & share your portfolio</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Pricing & CTA */}
        <div className="pricing-section">
          <p className="pricing-text">
            <strong>Only €10/month</strong> or <strong>€100/year</strong> for unlimited Pro benefits!
          </p>
          <ButtonLong text="Become Pro now"/>
        </div>
      </div>
    </div>
  );
}
