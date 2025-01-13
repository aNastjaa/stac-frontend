import { Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { ButtonLong } from "../components/Buttons";
import { X } from "lucide-react";
import "../css/landingPageMenu.css";

interface RootNavigationProps {
  isOpen: boolean;
  closeMenu: () => void;
}

function RootNavigation({ isOpen, closeMenu }: RootNavigationProps) {
  return (
    <div className={`landing-page-menu ${isOpen ? "open" : ""}`}>
      <div className="menu-content">
        <LinkIcon size={150} color="#E3E3E3" style={{ opacity: 0.2 }} />
        <h1>Explore the app</h1>
        <p>
          Now your creativity lives in one place— showcased, celebrated, and always evolving.
        </p>
        <button className="close-button" onClick={closeMenu}>
          <X size={40} color="#E3E3E3" />
        </button>
        <Link to="/register" onClick={closeMenu}>
          <ButtonLong text="Create Account" />
        </Link>
        <Link to="/login" onClick={closeMenu}>
          <ButtonLong text="Log In" />
        </Link>
      </div>
    </div>
  );
}

export default RootNavigation;
