import { createContext, useState, ReactNode, useEffect } from "react";

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
};

// Create context with the correct type
export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<Auth>(defaultAuth);

  // Load user and token from local storage (if any)
  useEffect(() => {
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
    }
  }, []);

  // Store auth in local storage on change
  useEffect(() => {
    if (auth.id) {
      localStorage.setItem("auth_user", JSON.stringify(auth)); // Save user to local storage
      localStorage.setItem("auth_token", localStorage.getItem('auth_token') || ''); // Ensure token is saved
    } else {
      localStorage.removeItem("auth_user"); // Clear user data if logged out
      localStorage.removeItem("auth_token"); // Remove token on logout
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children} {/* Render children components */}
    </AuthContext.Provider>
  );
};
