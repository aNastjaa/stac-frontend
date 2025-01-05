import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
  } from "react-router";
  
  // Layouts
    import RootLayout from "./layouts/RootLayout";
    import PrivateLayout from "./layouts/PrivateLayout";
    import AdminLayout from "./layouts/AdminLayout";
  
  // Errors
  import RootError from "./errors/RootError";
  
  // Pages
  import LandingPage from "./pages/LandingPage";
  import Login from "./pages/Login";
  import Register from "./pages/Register";
  import UserProfile from "./pages/UserProfile";
  import ArtWorks from "./pages/ArtWorks";
  import SponsorChallenges from "./pages/SponsorChallenges";
  import AdminDashboard from "./pages/AdminDashboard";
  import NotFound from "./pages/NotFound";
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Public Routes */}
        <Route
          path="/"
          element={<RootLayout />}
          errorElement={<RootError />}
        >
          <Route index element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>
  
        {/* Authenticated Routes */}
        <Route element={<PrivateLayout />}>
          <Route path="/artworks" element={<ArtWorks />} />
          <Route path="/sponsor-challenges" element={<SponsorChallenges />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>
  
        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </>
    )
  );
  
  export default router;
  