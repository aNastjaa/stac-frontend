import { X } from "lucide-react"; // Close icon
import { useLocation } from "react-router-dom"; // Hook to get current location
import { useState, useEffect } from "react"; // For handling state and side-effects
import { Link } from "react-router-dom"; // For navigation links

function PrivateNavigation({ isOpen, closeMenu }: { isOpen: boolean; closeMenu: () => void }) {
  const location = useLocation(); // Get the current location
  const [activeLink, setActiveLink] = useState<string>(location.pathname);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // State to track admin role

  useEffect(() => {
    // Check if user is an admin from localStorage or context
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role_name === "admin") {
        setIsAdmin(true); // If admin role, set isAdmin to true
      }
    }

    setActiveLink(location.pathname); // Update active link on route change
  }, [location]);

  const handleLinkClick = (link: string) => {
    setActiveLink(link); // Update active link when clicked
    closeMenu(); // Close the menu
  };

  return (
    <div className={`private-navigation-menu ${isOpen ? "open" : ""}`}>
      <div className="private-menu-content">
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
            {isAdmin && (
              <li>
                <Link
                  to="/admin/dashboard"
                  className={activeLink === "/admin/dashboard" ? "active" : ""}
                  onClick={() => handleLinkClick("/admin/dashboard")}
                >
                  Admin Dashboard
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default PrivateNavigation;
