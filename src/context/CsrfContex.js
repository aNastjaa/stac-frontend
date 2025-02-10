import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useContext, useEffect } from 'react';
import { setCsrfCookie, getCsrfTokenFromCookie } from '../utils/api'; // Your helper functions for CSRF handling
// Create the context
const CsrfContext = createContext(undefined);
// Custom hook to use the context
export const useCsrf = () => {
    const context = useContext(CsrfContext);
    if (!context) {
        throw new Error('useCsrf must be used within a CsrfProvider');
    }
    return context;
};
// Provider component to wrap the app and provide the CSRF token globally
export const CsrfProvider = ({ children }) => {
    const [csrfToken, setCsrfTokenState] = useState('');
    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                // Wait for cookie to be set
                await setCsrfCookie();
                // Extract the CSRF token from the cookie
                const token = getCsrfTokenFromCookie();
                if (token) {
                    setCsrfTokenState(token); // Set the CSRF token in state
                    console.log(token);
                }
            }
            catch (error) {
                console.error('Error fetching CSRF token:', error);
            }
        };
        fetchCsrfToken();
    }, []); // This effect runs only once when the app starts
    return (_jsx(CsrfContext.Provider, { value: { csrfToken, setCsrfCookie: setCsrfTokenState }, children: children }));
};
