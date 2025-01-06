import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { setCsrfCookie, getCsrfTokenFromCookie } from '../utils/api';  // Your helper functions for CSRF handling

// Define the context's type
interface CsrfContextType {
  csrfToken: string;
  setCsrfCookie: (token: string) => void;
}

// Create the context
const CsrfContext = createContext<CsrfContextType | undefined>(undefined);

// Custom hook to use the context
export const useCsrf = (): CsrfContextType => {
  const context = useContext(CsrfContext);
  if (!context) {
    throw new Error('useCsrf must be used within a CsrfProvider');
  }
  return context;
};

interface CsrfProviderProps {
  children: ReactNode;
}

// Provider component to wrap the app and provide the CSRF token globally
export const CsrfProvider = ({ children }: CsrfProviderProps) => {
  const [csrfToken, setCsrfTokenState] = useState<string>('');

  useEffect(() => {
    const fetchCsrfToken = async (): Promise<void> => {
      try {
        // Wait for cookie to be set
        await setCsrfCookie();

        // Extract the CSRF token from the cookie
        const token = getCsrfTokenFromCookie();
        if (token) {
          setCsrfTokenState(token);  // Set the CSRF token in state
          console.log(token)
        }
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);  // This effect runs only once when the app starts

  return (
    <CsrfContext.Provider value={{ csrfToken, setCsrfCookie: setCsrfTokenState }}>
      {children}
    </CsrfContext.Provider>
  );
};
