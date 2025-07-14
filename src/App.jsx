import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Loader from "./common/components/loader/GavelLoader";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboard from "./pages/AdminDashboard";
import { useEffect } from "react";

export default function App({ onReady }) {
  const { user, isSuperAdmin, loading, superAdminLoading } = useAuth();

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  if (loading || superAdminLoading) return <Loader />;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={!user ? <AuthPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/admin"
          element={isSuperAdmin ? <AdminDashboard /> : <Navigate to="/" replace />}
        />
        <Route
          path="/"
          element={user ? <DashboardPage /> : <Navigate to="/auth" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
