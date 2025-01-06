import { useState } from 'react';
import { login } from '../../utils/api'; // Import the login function
import { useNavigate } from 'react-router';
import { useCsrf } from '../../contex/CsrfContex';

const Login = () => {
  const { csrfToken } = useCsrf(); 
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await login(email, password, rememberMe, csrfToken);
      console.log('Logged in successfully', data.user);

      // Redirect to the profile page after successful login
      navigate('/profile'); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
      <input type="hidden" name="_token" id="token" value="{{ csrf_token() }}"/>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            Remember me
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;


// import axios from 'axios';
// export const api = axios.create({
//     baseURL: import.meta.env.VITE_API_URL,
//     withCredentials: true,
//     withXSRFToken: true,
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });