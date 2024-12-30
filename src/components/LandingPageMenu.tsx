import { Link as LinkIcon } from "lucide-react";
import { Link } from "react-router"; 
import { ButtonLong } from "../components/Buttons"; 
import { X } from "lucide-react"; 
import "../css/landingPageMenu.css"; 

// Props for the full-screen menu
function LandingPageMenu({ isOpen, closeMenu }: { isOpen: boolean, closeMenu: () => void }) {
  return (
    <div className={`landing-page-menu ${isOpen ? "open" : ""}`}>
      <div className="menu-content">
      <LinkIcon size={150} color="#E1E1E1" style={{ opacity: 0.2 }} /> 
        <h1>Explore the app</h1>
        <p>Now your creativity lives in one place—
            showcased, celebrated, and always evolving.</p>
        <button className="close-btn" onClick={closeMenu}>
          <X size={30} color="#E1E1E1" /> 
        </button>
        <Link to="/register">
          <ButtonLong text="Create Account" />
        </Link>
        <Link to="/login">
          <ButtonLong text="Log In" />
        </Link>
      </div>
    </div>
  );
}

export default LandingPageMenu;
