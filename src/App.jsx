import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Loader from "./common/components/loader/GavelLoader";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboard from "./pages/AdminDashboard";
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Error404 from "./pages/Error404";
import Error from "./pages/Error";
import CasesPage from "./pages/CasesPage";
import NavLayout from "./layouts/NavLayout";
import TestPage from "./pages/Test";
import SchoolInfoPage from "./pages/SchoolInfoPage";
import { useLocalStorage } from "@mantine/hooks";
import PrivacyAndSecurityPage from "./pages/PrivacyAndSecurityPage";
import SettingsPage from "./pages/SettingsPage";
import BetaOverlay from "./layouts/BetaOverlay";

export default function App({ onReady }) {
  const { user, isSuperAdmin, loading, superAdminLoading } = useAuth();

  const [selectedSchoolId] = useLocalStorage({
    key: "school",
    defaultValue: null
  });

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  if (loading || superAdminLoading) return <Loader />;

  return (
    <BrowserRouter>
      <ErrorBoundary FallbackComponent={Error}>
        <Routes>
          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/admin"
            element={
              isSuperAdmin ? (
                <NavLayout>
                  <AdminDashboard />
                </NavLayout>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/cases"
            element={
              <NavLayout>
                <CasesPage />
              </NavLayout>
            }
          />
          <Route
            path="/school"
            element={
              !user 
                ? <Navigate to="/auth" replace />
                : !selectedSchoolId
                  ? <Navigate to="/" replace />
                  : (
                    <NavLayout>
                      <SchoolInfoPage />
                    </NavLayout>
                  ) 
            }
          />
          <Route
            path="/admin-test"
            element={
              isSuperAdmin ? (
                <NavLayout>
                  <>
                    <TestPage />
                    <BetaOverlay />
                  </>
                </NavLayout>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/privacy-and-security"
            element={
              user ? (
                <NavLayout>
                  <PrivacyAndSecurityPage />
                </NavLayout>
              ) : (
                <PrivacyAndSecurityPage />
              )
            }
          />
          <Route
            path="/settings"
            element={
              user ? (
                <NavLayout>
                  <SettingsPage />
                </NavLayout>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/"
            element={
              user ? (
                <NavLayout>
                  <DashboardPage />
                </NavLayout>
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
          <Route
            path="*"
            element={
              <NavLayout>
                <Error404 />
              </NavLayout>
            }
          />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
