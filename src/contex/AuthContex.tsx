import { createContext, useState, ReactNode } from "react";

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

const defaultAuth: Auth = {
  id: null,
  username: null,
  role: null,
};

// Default values
const defaultAuthContext: AuthContextType = {
  auth: defaultAuth,
  setAuth: () => {},
};

// Context
export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<Auth>(defaultAuth);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
