import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contex/AuthContex";
import Footer from "../../components/Footer";
import PrivateNavbar from "../../components/PrivateNavbar";

const PrivateLayout = () => {
  const { auth } = useContext(AuthContext);

  if (!auth?.id) {
    // Redirect to login if the user is not authenticated
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <header>
        <PrivateNavbar /> {/* Render PrivateNavbar for private layout */}
      </header>
      <main>
        <Outlet /> {/* Render the children components here */}
      </main>
      <Footer />
    </div>
  );
};

export default PrivateLayout;
