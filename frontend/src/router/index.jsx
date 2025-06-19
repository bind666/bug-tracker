// Routing Page. ALl Routes Handels Here.
import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

// Layouts
import RootLayout from "../layouts/RootLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Context
import { AuthProvider } from "../context/AuthContext";
import { ProjectProvider } from "../context/ProjectContext";

// Route protection
import ProtectedRoute from "../components/common/ProtectedRoute";
import PublicRoute from "../components/common/PublicRoute";

// Lazy-loaded pages
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));
const Auth = lazy(() => import("../pages/Auth"));
const Tickets = lazy(() => import("../pages/tickets/Tickets"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <RootLayout />
      </AuthProvider>
    ),
    children: [
      {
        path: "",
        element: (
          <ProtectedRoute>
            <ProjectProvider> {/* Wrap inside ProjectProvider */}
              <DashboardLayout />
            </ProjectProvider>
          </ProtectedRoute>
        ),
        children: [
          {
            path: "dashboard",
            element: (
              <Suspense fallback={<p>Loading Dashboard...</p>}>
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: "profile",
            element: (
              <Suspense fallback={<p>Loading Profile...</p>}>
                <Profile />
              </Suspense>
            ),
          },
          {
            path: "tickets",
            element: (
              <Suspense fallback={<p>Loading Tickets...</p>}>
                <Tickets />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "auth",
        element: (
          <PublicRoute>
            <Suspense fallback={<p>Loading Auth...</p>}>
              <Auth />
            </Suspense>
          </PublicRoute>
        ),
      },
    ],
  },
]);

export default router;
