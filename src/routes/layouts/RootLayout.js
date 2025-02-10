import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation } from "react-router";
import Footer from "../../components/navigation/Footer";
import { Outlet } from "react-router";
import RootNavbar from "../../components/navigation/RootNavbar";
const RootLayout = () => {
    const location = useLocation();
    // Determine if dark mode should be applied
    const isDarkMode = location.pathname === "/login" || location.pathname === "/register";
    // Check if the current page is login or register to hide the footer
    const hideFooter = location.pathname === "/login" || location.pathname === "/register";
    return (_jsxs("div", { style: {
            backgroundColor: isDarkMode ? "#131313" : "#e3e3e3",
            minHeight: "100vh",
            margin: 0, // Ensure no margin on body
            padding: 0, // Ensure no padding on body
            display: "flex",
            flexDirection: "column",
            color: isDarkMode ? "#e3e3e3" : "#131313",
        }, children: [_jsxs("header", { children: [_jsx(RootNavbar, { isDarkMode: isDarkMode }), " "] }), _jsxs("main", { children: [_jsx(Outlet, {}), " "] }), !hideFooter && _jsx(Footer, { isDarkMode: isDarkMode }), " "] }));
};
export default RootLayout;
