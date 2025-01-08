import { Menu } from "lucide-react"; // Import the burger menu icon
import { useState } from "react";
import LandingPageMenu from "../components/RootNavigation"; // Import LandingPageMenu component
import "../css/navigation.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control the full-screen menu visibility

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the full-screen menu
  };

  return (
    <nav className="navbar">
      <div className="logo">stac</div>

      {/* Burger Menu Icon */}
      <div className="menu-icon" onClick={toggleMenu}>
        <Menu size={40} color="#131313" /> {/* Burger icon from lucide-react */}
      </div>

      {/* Render FullScreenMenu when burger menu is clicked */}
      <LandingPageMenu isOpen={isMenuOpen} closeMenu={toggleMenu} />
    </nav>
  );
}

export default Navbar;
