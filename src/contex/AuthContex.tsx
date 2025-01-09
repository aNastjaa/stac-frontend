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

  // Load user from local storage (if any)
  useEffect(() => {
    const storedUser = localStorage.getItem("auth");
    if (storedUser) {
      setAuth(JSON.parse(storedUser)); // Set user from local storage
    }
  }, []);

  // Store auth in local storage on change
  useEffect(() => {
    if (auth.id) {
      localStorage.setItem("auth", JSON.stringify(auth)); // Save user to local storage
    } else {
      localStorage.removeItem("auth"); // Clear user data if logged out
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children} {/* Render children components */}
    </AuthContext.Provider>
  );
};
