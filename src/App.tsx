import { createBrowserRouter, RouterProvider } from "react-router";
import { useEffect, useState } from "react";
import { setCsrfCookie, getCsrfTokenFromCookie} from './utils/api';

// Layouts
import RootLayout from "./routes/layouts/RootLayout"; // RootLayout for unlogged users

// Pages
import LandingPage from "./routes/pages/LandingPage"; // LandingPage for non-logged-in users
//import Register from "./routes/pages/Register"; // Register page
import Login from "./routes/pages/Login"; // Login page
// Wrapper to pass the csrfTokenState to Login component
const LoginWrapper = ({ csrfToken }: { csrfToken: string }) => {
  return <Login csrfToken={csrfToken} />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // Render RootLayout for non-logged-in users
    children: [
      {
        path: "/",
        element: <LandingPage />, // Render LandingPage for non-logged-in users
      },
      {
        path: "/login",
        element: <LoginWrapper csrfToken={''} />, // Pass an empty prop as placeholder
      },
    ],
  },
]);

const App = () => {
  const [csrfTokenState, setCsrfTokenState] = useState<string>('');

  useEffect(() => {
    const fetchCsrfToken = async (): Promise<void> => {
      try {
        //Wait for cookie to be set
        await setCsrfCookie();

        //Extractint token from cookie
        const csrfToken = getCsrfTokenFromCookie();

        //Save token in state if it was extracted
        if(csrfToken){
          setCsrfTokenState(csrfToken);
          console.log('CSRF token:', csrfToken);
        }
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
        
      }
    }; 
      fetchCsrfToken();
  }, []); // Empty dependency array ensures this runs only once

  return (
  <>
  <RouterProvider router={router} />;
  {/* {csrfTokenState && <Login csrfToken={csrfTokenState} />} */}
  </>
  );
};

export default App;
