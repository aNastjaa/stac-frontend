import { createBrowserRouter } from "react-router-dom";
import React, { lazy } from "react";

// Layouts
const RootLayout = lazy(() => import("./layouts/RootLayout"));
const PrivateLayout = lazy(() => import("./layouts/PrivateLayout"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));

// Pages
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const ArtWorks = lazy(() => import("./pages/ArtWorks"));
const SponsorChallenges = lazy(() => import("./pages/SponsorChallenges"));
const ChallengeDetail = lazy(() => import("../components/challenges/ChallengeDetail"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const EditProfile = lazy(() => import("../components/EditProfile"));

// Loading Component
import DotLoader from "../components/DotLoader";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <React.Suspense fallback={<DotLoader />}>
        <RootLayout />
      </React.Suspense>
    ),
    children: [
      {
        path: "/",
        element: (
          <React.Suspense fallback={<DotLoader />}>
            <LandingPage />
          </React.Suspense>
        ),
      },
      {
        path: "/register",
        element: (
          <React.Suspense fallback={<DotLoader />}>
            <Register />
          </React.Suspense>
        ),
      },
      {
        path: "/login",
        element: (
          <React.Suspense fallback={<DotLoader />}>
            <Login />
          </React.Suspense>
        ),
      },
      {
        path: "*",
        element: (
          <React.Suspense fallback={<DotLoader />}>
            <NotFound />
          </React.Suspense>
        ),
      },
    ],
  },

  // Authenticated Routes
  {
    element: (
      <React.Suspense fallback={<DotLoader />}>
        <PrivateLayout />
      </React.Suspense>
    ),
    children: [
      {
        path: "/profile",
        element: (
          <React.Suspense fallback={<DotLoader />}>
            <UserProfile />
          </React.Suspense>
        ),
      },
      {
        path: "/edit-profile",
        element: (
          <React.Suspense fallback={<DotLoader />}>
            <EditProfile />
          </React.Suspense>
        ),
      },
      {
        path: "/artworks",
        element: (
          <React.Suspense fallback={<DotLoader />}>
            <ArtWorks />
          </React.Suspense>
        ),
      },
      {
        path: "/sponsor-challenges",
        element: (
          <React.Suspense fallback={<DotLoader />}>
            <SponsorChallenges />
          </React.Suspense>
        ),
      },
      {
        path: "/sponsor-challenges/:challengeId", 
        element: (
          <React.Suspense fallback={<DotLoader />}>
            <ChallengeDetail />
          </React.Suspense>
        ),
      },
    ],
  },

  // Admin Routes
  {
    element: (
      <React.Suspense fallback={<DotLoader />}>
        <AdminLayout />
      </React.Suspense>
    ),
    children: [
      {
        path: "/admin/dashboard",
        element: (
          <React.Suspense fallback={<DotLoader />}>
            <AdminDashboard />
          </React.Suspense>
        ),
      },
    ],
  },
]);

export default router;
