import { Outlet } from "react-router";
import Footer from "../../components/Footer";
import RootNavbar from "../../components/RootNavbar";

const RootLayout = () => {
  return (
    <div>
      <header>
        <RootNavbar/> {/* Render Navbar for root layout */}
      </header>
      <main>
        <Outlet /> {/* Render the LandingPage here for non-logged-in users */}
      </main>
      <Footer/>
    </div>
  );
};

export default RootLayout;
