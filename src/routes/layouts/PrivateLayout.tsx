import { Navigate, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext"; // Import the AuthContext
import PrivateNavbar from "../../components/navigation/PrivateNavbar";
import Footer from "../../components/navigation/Footer";

const PrivateLayout = () => {
  const { auth, setAuth } = useContext(AuthContext); // Now TypeScript knows about `setAuth`
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    const storedToken = localStorage.getItem("auth_token");

    if (storedUser && storedToken) {
      const user = JSON.parse(storedUser);
      setAuth({
        id: user.id,
        username: user.username,
        email: user.email, // Ensure email is part of the state
        role_name: user.role_name, // Get the role_name to identify the role
      });

      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [setAuth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!auth?.id) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <header>
        <PrivateNavbar />
      </header>
      <main>
        <Outlet />
      </main>
      <Footer isDarkMode={false} />
    </div>
  );
};

export default PrivateLayout;
