import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm, SubmitHandler } from "react-hook-form";
import { login } from "../../utils/api";
import { ButtonLong } from "../../components/Buttons";
import "../../css/register-login.css";

type FormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Generate unique IDs for the form fields
  // const emailId = useId();
  // const passwordId = useId();
  // const rememberMeId = useId();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  // Handle login form submission
  const onSubmit: SubmitHandler<FormData> = async (data) => {
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
        // Assuming login is successful, store user info in local storage
        localStorage.setItem("auth", JSON.stringify(response.user));

        alert("Login successful!");
        navigate("/profile"); // Redirect to profile page
      } else {
        setError("Invalid credentials or an error occurred.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred while logging in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-wrapper">
      <h1 className="login-header">Hey, wellcome 👋</h1>
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        
        <div className={`input-field ${errors.email ? "has-error" : ""}`}>
          <label htmlFor="email" className="input-label">Email</label>
          <input
            id="email"
            type="email"
            placeholder="example@mail.com"
            className="input-field-input"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <small className="error-message">{errors.email.message}</small>}
        </div>
  
        <div className={`input-field ${errors.password ? "has-error" : ""}`}>
          <label htmlFor="password" className="input-label">Password</label>
          <input
            id="password"
            type="password"
            placeholder="At least 8 characters"
            className="input-field-input"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <small className="error-message">{errors.password.message}</small>}
        </div>
  
        <div className="remember-me">
          <label className="remember-me-label">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="remember-me-checkbox"
            />
            Remember me
          </label>
        </div>
  
        <div className="button-position">
          <ButtonLong text={loading ? "Logging in..." : "Login"} disabled={loading} />
        </div>
  
        {error && <p className="error-message">{error}</p>}
  
        <footer className="register-link">
          <p>Don't have an account yet? <a href="/signup" className="footer-link-text">Create account</a></p>
        </footer>
      </form>
    </div>
  );
  
};

export default Login;
