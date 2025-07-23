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

const BetaOverlay = () => {
  return (
    <div style={{
      position: 'fixed',  // Changed to absolute to contain within parent
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 1,
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '200%',  // Increased coverage area
        height: '200%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gridAutoRows: 'minmax(100px, auto)',
        transform: 'rotate(-30deg)',
      }}>
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} style={{
            color: 'rgba(0,0,0,0.1)',
            fontSize: '2rem',
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            BETA
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App({ onReady }) {
  const { user, isSuperAdmin, loading, superAdminLoading } = useAuth();

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
