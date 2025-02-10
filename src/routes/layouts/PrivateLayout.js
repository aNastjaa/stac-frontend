import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
        }
        else {
            setLoading(false);
        }
    }, [setAuth]);
    if (loading) {
        return _jsx("div", { children: "Loading..." });
    }
    if (!auth?.id) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return (_jsxs("div", { children: [_jsx("header", { children: _jsx(PrivateNavbar, {}) }), _jsx("main", { children: _jsx(Outlet, {}) }), _jsx(Footer, { isDarkMode: false })] }));
};
export default PrivateLayout;
