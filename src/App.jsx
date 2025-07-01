import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Loader } from "@mantine/core";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const { user, isSuperAdmin, loading, superAdminLoading } = useAuth();

  if (loading || superAdminLoading) return <Loader />;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={!user ? <AuthPage /> : <Navigate to="/" />}
        />
        <Route
          path="/admin"
          element={isSuperAdmin ? <AdminDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={user ? <DashboardPage /> : <Navigate to="/auth" />}
        />
      </Routes>
    </BrowserRouter>
  );
}
