import { useState, useId } from "react";
import { useNavigate } from "react-router";
import { useForm, SubmitHandler } from "react-hook-form";
import { login } from "../../utils/api";

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
  const emailId = useId();
  const passwordId = useId();
  const rememberMeId = useId();

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor={emailId}>Email</label>
        <input
          id={emailId}
          type="email"
          placeholder="example@mail.com"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <label htmlFor={passwordId}>Password</label>
        <input
          id={passwordId}
          type="password"
          placeholder="******"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <div>
        <label htmlFor={rememberMeId}>
          <input
            type="checkbox"
            id={rememberMeId}
            {...register("rememberMe")}
          />
          Remember me
        </label>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      {error && <p>{error}</p>}
    </form>
  );
};

export default Login;
