import ProtectedRoute from "./ProtectedRoute";
import { Outlet } from "react-router-dom";

export default function ProtectedRouteWrapper() {
  return (
    <ProtectedRoute redirectPath="/auth">
      <Outlet />
    </ProtectedRoute>
  );
}
