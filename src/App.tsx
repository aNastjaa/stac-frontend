import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts
import RootLayout from "./routes/layouts/RootLayout"; // RootLayout for unlogged users

// Pages
import LandingPage from "./routes/pages/LandingPage"; // LandingPage for non-logged-in users
import Register from "./routes/pages/Register"; // Register page
import Login from "./routes/pages/Login"; // Login page

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
        element: <Login />, // Login page
      },
      {
        path: "/register",
        element: <Register />, // Register page
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
