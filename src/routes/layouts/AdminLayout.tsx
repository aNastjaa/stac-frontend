import { Navigate, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import PrivateNavbar from "../../components/navigation/PrivateNavbar";
import Footer from "../../components/navigation/Footer";

const AdminLayout = () => {
  const { auth, setAuth } = useContext(AuthContext); 
  const [loading, setLoading] = useState(true); 
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    const storedToken = localStorage.getItem("auth_token");

    if (storedUser && storedToken) {
      const user = JSON.parse(storedUser);
      setAuth({
        id: user.id,
        username: user.username,
        email: user.email,
        role_name: user.role_name,
      });

      // Check if the user is an admin
      if (user.role_name === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }

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

  if (!isAdmin) {
    return <Navigate to="/" replace />;
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

export default AdminLayout;
