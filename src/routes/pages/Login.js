import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { login } from "../../utils/api";
import { ButtonLong } from "../../components/Buttons";
import "../../css/register-login.css";
const Login = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    // Handle login form submission
    const onSubmit = async (data) => {
        setLoading(true);
        setError(null); // Reset error message
        try {
            const csrfToken = document.cookie
                .split("; ")
                .find((row) => row.startsWith("XSRF-TOKEN="))?.split("=")[1];
            if (!csrfToken) {
                setError("CSRF token not found.");
                setLoading(false);
                return;
            }
            const response = await login(data.email, data.password, data.rememberMe, csrfToken);
            if (response.user) {
                // Store the token in localStorage if login is successful
                localStorage.setItem("auth_token", response.token); // Store token
                localStorage.setItem("auth_user", JSON.stringify(response.user)); // Store user data
                alert("Login successful!");
                navigate("/profile"); // Redirect to profile page
            }
            else {
                setError("Invalid credentials or an error occurred.");
            }
        }
        catch (error) {
            console.error("Login error:", error);
            setError("Invalid credentials, check your email and password and try again.");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "main-wrapper", children: [_jsx("h1", { className: "login-header", children: "Hey, welcome \uD83D\uDC4B" }), _jsxs("form", { className: "login-form", onSubmit: handleSubmit(onSubmit), children: [_jsxs("div", { className: `input-field ${errors.email ? "has-error" : ""}`, children: [_jsx("label", { htmlFor: "email", className: "input-label", children: "Email" }), _jsx("input", { id: "email", type: "email", placeholder: "example@mail.com", className: "input-field-input", ...register("email", { required: "Email is required" }) }), errors.email && _jsx("small", { className: "error-message", children: errors.email.message })] }), _jsxs("div", { className: `input-field ${errors.password ? "has-error" : ""}`, children: [_jsx("label", { htmlFor: "password", className: "input-label", children: "Password" }), _jsx("input", { id: "password", type: "password", placeholder: "Enter your password", className: "input-field-input", ...register("password", { required: "Password is required" }) }), errors.password && _jsx("small", { className: "error-message", children: errors.password.message })] }), _jsx("div", { className: "remember-me", children: _jsxs("label", { className: "remember-me-label", children: [_jsx("input", { type: "checkbox", ...register("rememberMe"), className: "remember-me-checkbox" }), "Remember me"] }) }), _jsx("div", { className: "button-position", children: _jsx(ButtonLong, { text: loading ? "Logging in..." : "Login", disabled: loading }) }), error && _jsx("p", { className: "backend-error", children: error }), _jsx("footer", { className: "login-link", children: _jsxs("p", { children: ["Don't have an account yet? ", _jsx("a", { href: "/register", className: "footer-link-text", children: "Create account" })] }) })] })] }));
};
export default Login;
