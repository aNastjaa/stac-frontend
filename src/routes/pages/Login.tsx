import { useState, useId } from "react";
import { useNavigate } from "react-router";
import { login } from "../../utils/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Generate unique IDs for the form fields
  const emailId = useId();
  const passwordId = useId();
  const rememberMeId = useId();

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))?.split("=")[1];

      if (!csrfToken) {
        setError("CSRF token not found.");
        setLoading(false);
        return;
      }

      const response = await login(email, password, rememberMe, csrfToken);

      if (response.user) {
        alert("Login successful!");
        navigate("/profile"); // Redirect to dashboard or homepage after successful login
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
    <form onSubmit={(e) => e.preventDefault()}>
      <div>
        <label htmlFor={emailId}>Email</label>
        <input
          id={emailId}
          type="email"
          placeholder="example@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor={passwordId}>Password</label>
        <input
          id={passwordId}
          type="password"
          placeholder="******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor={rememberMeId}>
          <input
            type="checkbox"
            id={rememberMeId}
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          Remember me
        </label>
      </div>

      <button type="submit" disabled={loading} onClick={handleSubmit}>
        {loading ? "Logging in..." : "Login"}
      </button>

      {error && <p>{error}</p>}
    </form>
  );
};

export default Login;
