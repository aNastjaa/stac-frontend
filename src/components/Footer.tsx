import "../css/footer.css";

interface FooterProps {
  isDarkMode: boolean;  // Prop to handle dark mode
}

const Footer = ({ isDarkMode }: FooterProps) => {
  return (
    <footer className={`footer ${isDarkMode ? "dark" : "light"}`}> {/* Apply light or dark style */}
      <div className="footer-content">
        <div className="footer-text">
          <span className="footer-logo">stac</span>
          <p className="footer-tagline">SHOWCASE OF THEMATIC ART CREATIONS</p>
        </div>
        <div className="footer-links">
          <p>support@stac.com</p>
          <p>© STAC 2025</p>
        </div>
        <div className="footer-nav">
          <a href="#">FAQ |</a> <a href="#">Privacy Policy |</a> <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;