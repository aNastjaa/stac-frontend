import { Outlet } from "react-router";
import Navbar from "../../components/Navbar"; // Import the Navbar component
import Footer from "../../components/Footer";

const RootLayout = () => {
  return (
    <div>
      <header>
        <Navbar /> {/* Render Navbar for root layout */}
      </header>
      <main>
        <Outlet /> {/* Render the LandingPage here for non-logged-in users */}
      </main>
      <Footer/>
    </div>
  );
};

export default RootLayout;
