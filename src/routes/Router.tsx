// src/router.ts
import { createBrowserRouter } from "react-router";

// Layouts
import RootLayout from "./layouts/RootLayout"; // RootLayout for non-logged-in users
import PrivateLayout from "./layouts/PrivateLayout"; // PrivateLayout for authenticated users
import AdminLayout from "./layouts/AdminLayout"; // AdminLayout for admin users

// Pages
import LandingPage from "./pages/LandingPage"; // LandingPage for non-logged-in users
import Register from "./pages/Register"; // Register page
import Login from "./pages/Login"; // Login page
import UserProfile from "./pages/UserProfile"; // User profile page
import ArtWorks from "./pages/ArtWorks"; // ArtWorks page
import SponsorChallenges from "./pages/SponsorChallenges"; // SponsorChallenges page
import AdminDashboard from "./pages/AdminDashboard"; // Admin Dashboard page
import NotFound from "./pages/NotFound"; // NotFound page

const router = createBrowserRouter([
  // Public Routes
  {
    path: "/",
    element: <RootLayout />, // Using RootLayout as a value
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },

  // Authenticated Routes
  {
    element: <PrivateLayout />, // Only accessible if logged in
    children: [
      {
        path: "/profile",
        element: <UserProfile />,
      },
      {
        path: "/artworks",
        element: <ArtWorks />,
      },
      {
        path: "/sponsor-challenges",
        element: <SponsorChallenges />,
      },
    ],
  },

  // Admin Routes
  {
    element: <AdminLayout />,
    children: [
      {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
      },
    ],
  },
]);

export default router;
