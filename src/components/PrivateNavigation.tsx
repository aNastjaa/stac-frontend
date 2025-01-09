import { X } from "lucide-react";
import { useLocation } from "react-router-dom"; // Get location using useLocation hook
import { useState, useEffect } from "react"; // Import useState and useEffect for state management and side effects
import { Link } from "react-router-dom";

function PrivateNavigation({ isOpen, closeMenu }: { isOpen: boolean; closeMenu: () => void }) {
  const location = useLocation(); // Get the current location from React Router
  const [activeLink, setActiveLink] = useState<string>(location.pathname); // Initialize active link with the current pathname

  // Update active link whenever the location changes (on page change)
  useEffect(() => {
    setActiveLink(location.pathname); // Update active link to match the current location
  }, [location]); // Dependency array ensures the effect runs whenever location changes

  const handleLinkClick = (link: string) => {
    setActiveLink(link); // Set the active link state
    closeMenu(); // Close the menu on link click
  };

  return (
    <div className={`private-navigation-menu ${isOpen ? "open" : ""}`}>
      <div className="menu-content">
        <div className="nav-menu-content">
            <div className="logo">stac</div>
            <button className="close-btn" onClick={closeMenu}>
            <X size={40} color="#e3e3e3" />
            </button>
        </div>
        <nav>
          <ul>
            <li>
              <Link
                to="/artworks"
                className={activeLink === "/artworks" ? "active" : ""}
                onClick={() => handleLinkClick("/artworks")}
              >
                Artworks
              </Link>
            </li>
            <li>
              <Link
                to="/sponsor-challenges"
                className={activeLink === "/sponsor-challenges" ? "active" : ""}
                onClick={() => handleLinkClick("/sponsor-challenges")}
              >
                Challenges
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className={activeLink === "/profile" ? "active" : ""}
                onClick={() => handleLinkClick("/profile")}
              >
                Profile
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default PrivateNavigation;
