import { useState } from "react";
import { Menu } from "lucide-react";
import "../../css/rootNavigation.css";
import RootNavigation from "../navigation/RootNavigation";

// Define the props interface
interface RootNavbarProps {
  isDarkMode: boolean; // Prop to handle dark mode
}

function RootNavbar({ isDarkMode }: RootNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`navbar ${isDarkMode ? "dark" : "light"}`}>
      <div className="nav-content">
        <div className="logo-navbar">stac</div>
        <div className="menu-icon" onClick={toggleMenu}>
          <Menu size={40} color={isDarkMode ? "#e3e3e3" : "#131313"} />
        </div>
      </div>

      {isOpen && <RootNavigation isOpen={isOpen} closeMenu={toggleMenu} isDarkMode={isDarkMode} />}
    </nav>
  );
}

export default RootNavbar;
