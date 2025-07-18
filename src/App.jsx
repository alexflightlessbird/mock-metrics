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
            element={isSuperAdmin ? <NavLayout><AdminDashboard /></NavLayout> : <Navigate to="/" replace />}
          />
          <Route
            path="/cases"
            element={<NavLayout><CasesPage /></NavLayout>}
          />
          <Route
            path="/"
            element={user ? <NavLayout><DashboardPage /></NavLayout> : <Navigate to="/auth" replace />}
          />
          <Route path="*" element={<NavLayout><Error404 /></NavLayout>} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
