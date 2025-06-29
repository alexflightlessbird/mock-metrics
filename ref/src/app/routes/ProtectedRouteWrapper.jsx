// Dependency imports
import { Outlet } from "react-router-dom";

// Component imports
import ProtectedRoute from "./ProtectedRoute";

export default function ProtectedRouteWrapper() {
  return (
    <ProtectedRoute redirectPath="/auth">
      <Outlet />
    </ProtectedRoute>
  );
}
