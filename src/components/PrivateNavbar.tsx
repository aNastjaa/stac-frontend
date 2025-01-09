import { Menu } from "lucide-react"; // Burger menu icon from lucide-react
import { useState } from "react";
import PrivateNavigation from "./PrivateNavigation"; // Import PrivateNavigation component
import "../css/rootNavigation.css";

function PrivateNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control the full-screen menu visibility

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the full-screen menu
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="logo-navbar">stac</div>

        {/* Burger Menu Icon */}
        <div className="menu-icon" onClick={toggleMenu}>
          <Menu size={40} color="#131313" /> {/* Burger icon */}
        </div>
      </div>
      

      {/* Render Full-Screen Menu when burger menu is clicked */}
      <PrivateNavigation isOpen={isMenuOpen} closeMenu={toggleMenu} />
    </nav>
  );
}

export default PrivateNavbar;
