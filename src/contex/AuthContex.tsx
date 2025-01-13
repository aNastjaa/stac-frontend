import { createContext, useState, ReactNode, useEffect } from "react";

// Types
type Auth = {
  id: string | null;
  username: string | null;
  role: "admin" | "pro" | "basic" | null;
};

type AuthContextType = {
  auth: Auth;
  setAuth: React.Dispatch<React.SetStateAction<Auth>>;
};

// Default Auth state
const defaultAuth: Auth = {
  id: null,
  username: null,
  role: null,
};

// Default context state
const defaultAuthContext: AuthContextType = {
  auth: defaultAuth,
  setAuth: () => {},
};

// Context creation
export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<Auth>(defaultAuth);

  // Load user and token from local storage (if any)
  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    const token = localStorage.getItem("auth_token");

    if (storedUser && token) {
      const user = JSON.parse(storedUser);
      setAuth(user); // Set user from local storage
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
