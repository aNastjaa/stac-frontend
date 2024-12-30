import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contex/AuthContex";

const AdminLayout = () => {
  const { auth } = useContext(AuthContext);

  // Redirect if not an admin
  if (auth.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <header>
        <h1>Admin Dashboard</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
