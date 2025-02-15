import { Menu } from "lucide-react";
import { useState } from "react";
import PrivateNavigation from "./PrivateNavigation";
import "../../css/privateNavigation.css";

function PrivateNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
