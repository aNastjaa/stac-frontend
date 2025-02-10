import { jsx as _jsx } from "react/jsx-runtime";
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
        element: (_jsx(React.Suspense, { fallback: _jsx(DotLoader, {}), children: _jsx(RootLayout, {}) })),
        children: [
            {
                path: "/",
                element: (_jsx(React.Suspense, { fallback: _jsx(DotLoader, {}), children: _jsx(LandingPage, {}) })),
            },
            {
                path: "/register",
                element: (_jsx(React.Suspense, { fallback: _jsx(DotLoader, {}), children: _jsx(Register, {}) })),
            },
            {
                path: "/login",
                element: (_jsx(React.Suspense, { fallback: _jsx(DotLoader, {}), children: _jsx(Login, {}) })),
            },
            {
                path: "*",
                element: (_jsx(React.Suspense, { fallback: _jsx(DotLoader, {}), children: _jsx(NotFound, {}) })),
            },
        ],
    },
    // Authenticated Routes
    {
        element: (_jsx(React.Suspense, { fallback: _jsx(DotLoader, {}), children: _jsx(PrivateLayout, {}) })),
        children: [
            {
                path: "/profile",
                element: (_jsx(React.Suspense, { fallback: _jsx(DotLoader, {}), children: _jsx(UserProfile, {}) })),
            },
            {
                path: "/edit-profile",
                element: (_jsx(React.Suspense, { fallback: _jsx(DotLoader, {}), children: _jsx(EditProfile, {}) })),
            },
            {
                path: "/artworks",
                element: (_jsx(React.Suspense, { fallback: _jsx(DotLoader, {}), children: _jsx(ArtWorks, {}) })),
            },
            {
                path: "/sponsor-challenges",
                element: (_jsx(React.Suspense, { fallback: _jsx(DotLoader, {}), children: _jsx(SponsorChallenges, {}) })),
            },
            {
                path: "/sponsor-challenges/:challengeId",
                element: (_jsx(React.Suspense, { fallback: _jsx(DotLoader, {}), children: _jsx(ChallengeDetail, {}) })),
            },
        ],
    },
    // Admin Routes
    {
        element: (_jsx(React.Suspense, { fallback: _jsx(DotLoader, {}), children: _jsx(AdminLayout, {}) })),
        children: [
            {
                path: "/admin/dashboard",
                element: (_jsx(React.Suspense, { fallback: _jsx(DotLoader, {}), children: _jsx(AdminDashboard, {}) })),
            },
        ],
    },
]);
export default router;
