import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navigate, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext"; // Import the AuthContext
import PrivateNavbar from "../../components/navigation/PrivateNavbar";
import Footer from "../../components/navigation/Footer";
const AdminLayout = () => {
    const { auth, setAuth } = useContext(AuthContext); // Destructure setAuth to update context
    const [loading, setLoading] = useState(true); // State to track if we are loading auth data
    const [isAdmin, setIsAdmin] = useState(false); // State to track if user is admin
    useEffect(() => {
        const storedUser = localStorage.getItem("auth_user");
        const storedToken = localStorage.getItem("auth_token");
        if (storedUser && storedToken) {
            const user = JSON.parse(storedUser);
            setAuth({
                id: user.id,
                username: user.username,
                email: user.email, // Ensure email is part of the state
                role_name: user.role_name, // Check the role name
            });
            // Check if the user is an admin
            if (user.role_name === "admin") {
                setIsAdmin(true);
            }
            else {
                setIsAdmin(false); // Ensure non-admins are not accessing admin layout
            }
            setLoading(false);
        }
        else {
            setLoading(false);
        }
    }, [setAuth]);
    if (loading) {
        return _jsx("div", { children: "Loading..." }); // Show loading indicator
    }
    if (!auth?.id) {
        return _jsx(Navigate, { to: "/login", replace: true }); // If user is not authenticated, redirect to login
    }
    if (!isAdmin) {
        return _jsx(Navigate, { to: "/", replace: true }); // Redirect non-admins
    }
    return (_jsxs("div", { children: [_jsx("header", { children: _jsx(PrivateNavbar, {}) }), _jsx("main", { children: _jsx(Outlet, {}) }), _jsx(Footer, { isDarkMode: false })] }));
};
export default AdminLayout;
