import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useId, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { register } from "../../utils/api";
import { Link } from "react-router";
import { ButtonLong } from "../../components/Buttons";
import "../../css/register-login.css";
const Register = () => {
    const usernameId = useId();
    const emailId = useId();
    const passwordId = useId();
    const passwordRepeatId = useId();
    const navigate = useNavigate();
    const [passwordFocus, setPasswordFocus] = useState(false);
    const [backendErrors, setBackendErrors] = useState({});
    const { register: registerField, watch, formState: { errors }, handleSubmit, } = useForm();
    const onValid = async (data) => {
        setBackendErrors({}); // Clear previous backend errors
        try {
            const formData = new FormData();
            formData.append("username", data.username);
            formData.append("email", data.email);
            formData.append("password", data.password);
            const response = await register(formData);
            if (response.success) {
                alert("Registration successful!");
                navigate("/login"); // Redirect to login page
            }
            else {
                // Handle backend validation errors
                setBackendErrors(response.errors || {});
            }
        }
        catch (error) {
            console.error("Registration error:", error);
            alert("Registration failed. Please try again.");
        }
    };
    return (_jsx(_Fragment, { children: _jsxs("div", { className: "main-wrapper", children: [_jsx("h1", { className: "register-header", children: "Sign Up \u270D\uFE0F" }), _jsxs("form", { className: "register-form", onSubmit: handleSubmit(onValid), children: [_jsxs("div", { className: `input-field ${errors.username ? "has-error" : ""}`, children: [_jsx("label", { htmlFor: usernameId, children: "Username" }), _jsx("input", { id: usernameId, type: "text", placeholder: "username", ...registerField("username", {
                                        required: "Username is required.",
                                        minLength: { value: 3, message: "Must be at least 3 characters." },
                                    }) }), _jsx("small", { children: errors.username?.message }), _jsx("small", { children: backendErrors.username?.[0] })] }), _jsxs("div", { className: `input-field ${errors.email ? "has-error" : ""}`, children: [_jsx("label", { htmlFor: emailId, children: "Email" }), _jsx("input", { id: emailId, type: "email", placeholder: "example@mail.com", ...registerField("email", {
                                        required: "Email is required.",
                                        pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email format." },
                                    }) }), _jsx("small", { children: errors.email?.message }), _jsx("small", { children: backendErrors.email?.[0] })] }), _jsxs("div", { className: `input-field ${errors.password ? "has-error" : ""}`, children: [_jsx("label", { htmlFor: passwordId, children: "Password" }), _jsx("input", { id: passwordId, type: "password", placeholder: "password", onFocus: () => setPasswordFocus(true), ...registerField("password", {
                                        required: "Password is required.",
                                        minLength: { value: 8, message: "Must be at least 8 characters." },
                                    }) }), _jsx("small", { children: errors.password?.message }), backendErrors.password &&
                                    backendErrors.password.map((err, index) => _jsx("p", { children: err }, index)), passwordFocus && (_jsxs("div", { className: "password-requirements", children: [_jsx("p", { className: watch("password").length >= 8 ? "valid" : "invalid", children: "Must be at least 8 characters." }), _jsx("p", { className: /[A-Z]/.test(watch("password")) ? "valid" : "invalid", children: "Must contain at least one capital letter." }), _jsx("p", { className: /\d/.test(watch("password")) ? "valid" : "invalid", children: "Must contain at least one number." }), _jsx("p", { className: /[!@#$%^&*(),.?":{}|<>]/.test(watch("password")) ? "valid" : "invalid", children: "Must contain at least one symbol." })] }))] }), _jsxs("div", { className: `input-field ${errors.passwordRepeat ? "has-error" : ""}`, children: [_jsx("label", { htmlFor: passwordRepeatId, children: "Repeat Password" }), _jsx("input", { id: passwordRepeatId, type: "password", placeholder: "repeat your password", ...registerField("passwordRepeat", {
                                        required: "Please repeat your password.",
                                        validate: (value) => value === watch("password") || "Passwords do not match.",
                                    }) }), _jsx("small", { children: errors.passwordRepeat?.message })] }), _jsx("div", { className: "button-position", children: _jsx(ButtonLong, { text: "Sign Up", onClick: handleSubmit(onValid) }) }), _jsx("div", { className: "register-link", children: _jsxs("p", { children: ["Already have an account?", " ", _jsx(Link, { to: "/login", children: "Log in" })] }) })] })] }) }));
};
export default Register;
