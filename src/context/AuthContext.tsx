import { createContext, useState, ReactNode, useEffect } from "react";
import { validateToken, setCsrfCookie, getCsrfTokenFromCookie } from "../utils/api";

// Define types for Auth
type Auth = {
  id: string | null;
  username: string | null;
  email: string | null;
  role_name: "admin" | "pro" | "basic" | null;
};

// Define the context type
type AuthContextType = {
  auth: Auth;
  setAuth: React.Dispatch<React.SetStateAction<Auth>>;
  validateToken: () => void;
  logout: () => void;
};

// Default Auth state
const defaultAuth: Auth = {
  id: null,
  username: null,
  email: null,
  role_name: "basic",
};

// Default context state
const defaultAuthContext: AuthContextType = {
  auth: defaultAuth,
  setAuth: () => {},
  validateToken: () => {},
  logout: () => {},
};

// Create context with the correct type
export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<Auth>(defaultAuth);

  // Check for existing auth data and token on page load
  useEffect(() => {
    console.log("AuthProvider useEffect triggered");

    const storedUser = localStorage.getItem("auth_user");
    const storedToken = localStorage.getItem("auth_token");

    if (storedUser && storedToken) {
      const user = JSON.parse(storedUser);
      setAuth({
        id: user.id,
        username: user.username,
        email: user.email,
        role_name: user.role_name,
      });

      // Proceed to validate token if present
      const fetchCsrfTokenAndValidate = async () => {
        try {
          // Ensure CSRF token is set before validating the main auth token
          await setCsrfCookie();
          console.log("CSRF cookie set");

          const csrfToken = getCsrfTokenFromCookie();  // Get CSRF token from cookies
          const isTokenValid = await validateToken(storedToken, csrfToken);  // Validate the auth token

          if (!isTokenValid) {
            console.log("Token is invalid or expired. Logging out...");
            setAuth(defaultAuth);  // Clear auth state if the token is invalid
            localStorage.removeItem("auth_user");  // Clear localStorage on invalid token
            localStorage.removeItem("auth_token"); // Clear localStorage on invalid token
          }
        } catch (error) {
          console.error("Error during token validation:", error);
          setAuth(defaultAuth);  // Clear auth state if an error occurs
          localStorage.removeItem("auth_user");  // Clear localStorage on error
          localStorage.removeItem("auth_token"); // Clear localStorage on error
        }
      };

      fetchCsrfTokenAndValidate();  // Trigger token validation on load
    }
  }, []);

  // Store auth in local storage on change
  useEffect(() => {
    if (auth.id) {
      // Ensure auth_user and auth_token are saved to localStorage when user is logged in
      localStorage.setItem("auth_user", JSON.stringify(auth));
      const token = localStorage.getItem("auth_token");  // Check if token is already in localStorage
      if (token && token !== "") {
        localStorage.setItem("auth_token", token); // Keep token in localStorage
      }
    }
  }, [auth]);  // Only run when `auth` changes

  // Function to trigger token validation manually
  const validateAuthToken = async () => {
    const storedToken = localStorage.getItem("auth_token");
    if (!storedToken) return;  // No token, no validation

    try {
      await setCsrfCookie();  // Ensure CSRF token is set
      const csrfToken = getCsrfTokenFromCookie();  // Get CSRF token from cookies
      const isTokenValid = await validateToken(storedToken, csrfToken);  // Validate auth token

      if (!isTokenValid) {
        console.log("Token is invalid or expired. Logging out...");
        setAuth(defaultAuth);  // Clear auth state if invalid
        localStorage.removeItem("auth_user");  // Clear localStorage on invalid token
        localStorage.removeItem("auth_token"); // Clear localStorage on invalid token
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      setAuth(defaultAuth);  // Clear auth state if validation fails
      localStorage.removeItem("auth_user");  // Clear localStorage on validation failure
      localStorage.removeItem("auth_token"); // Clear localStorage on validation failure
    }
  };

  // Logout function: removes auth info from state and local storage
  const logout = () => {
    setAuth(defaultAuth);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, validateToken: validateAuthToken, logout }}>
      {children} {/* Render children components */}
    </AuthContext.Provider>
  );
};
