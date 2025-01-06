import { createBrowserRouter, RouterProvider } from "react-router";

// Layouts
import RootLayout from "./routes/layouts/RootLayout"; // RootLayout for unlogged users

// Pages
import LandingPage from "./routes/pages/LandingPage"; // LandingPage for non-logged-in users
//import Register from "./routes/pages/Register"; // Register page
import Login from "./routes/pages/Login"; // Login page
import { CsrfProvider } from "./contex/CsrfContex";


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
        element: <Login />, // Pass an empty prop as placeholder
      },
    ],
  },
]);

const App = () => {
  return (
    <CsrfProvider>
      <RouterProvider router={router} />
    </CsrfProvider>
  );
};

export default App;
