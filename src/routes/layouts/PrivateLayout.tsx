import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contex/AuthContex";

const PrivateLayout = () => {
  const { auth } = useContext(AuthContext);

  if (!auth?.id) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <header>
        <h1>Welcome, {auth.username || "User"}</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateLayout;
