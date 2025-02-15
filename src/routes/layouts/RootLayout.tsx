import { useLocation } from "react-router";
import Footer from "../../components/navigation/Footer";
import { Outlet } from "react-router";
import RootNavbar from "../../components/navigation/RootNavbar";

const RootLayout = () => {
  const location = useLocation();

  // Determine if dark mode should be applied
  const isDarkMode = location.pathname === "/login" || location.pathname === "/register";

  // Check if the current page is login or register to hide the footer
  const hideFooter = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div style={{
      backgroundColor: isDarkMode ? "#131313" : "#e3e3e3",
      minHeight: "100vh",
      margin: 0, 
      padding: 0,
      display: "flex",
      flexDirection: "column",
      color: isDarkMode ? "#e3e3e3" : "#131313",
    }}>
      <header>
        <RootNavbar isDarkMode={isDarkMode} /> 
      </header>
      <main>
        <Outlet /> {/* Render the LandingPage or other pages */}
      </main>

      {/* Conditionally render Footer, hide on login/register pages */}
      {!hideFooter && <Footer isDarkMode={isDarkMode} />}
    </div>
  );
};

export default RootLayout;
