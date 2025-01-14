import { Navigate, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contex/AuthContex";
import Footer from "../../components/navigation/Footer";
import PrivateNavbar from "../../components/navigation/PrivateNavbar";

const PrivateLayout = () => {
  const { auth, setAuth } = useContext(AuthContext); // Destructure setAuth to update context
  const [loading, setLoading] = useState(true); // State to track if we are loading auth data

  useEffect(() => {
    // Checking if auth data is being properly loaded from localStorage
    const storedUser = localStorage.getItem('auth_user');
    const storedToken = localStorage.getItem('auth_token');

    console.log('Stored User:', storedUser);
    console.log('Stored Token:', storedToken);

    // If user data and token are available, set the auth state
    if (storedUser && storedToken) {
      const user = JSON.parse(storedUser);
      console.log('Loaded Auth:', user);

      // Set the auth context with the loaded user data
      setAuth({
        id: user.id,
        username: user.username,
        role: user.role_id,
      });

      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [setAuth]);

  if (loading) {
    return <div>Loading...</div>; // Show loading spinner or message
  }

  if (!auth?.id) {
    console.log('Redirecting to login, user is not authenticated');
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
      <Footer isDarkMode={false} />
    </div>
  );
};

export default PrivateLayout;
