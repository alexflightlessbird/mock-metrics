import ProtectedRoute from "./ProtectedRoute";

function ProtectedRouteWrapper({ children }) {
  return <ProtectedRoute redirectPath="/login">{children}</ProtectedRoute>;
}

export default ProtectedRouteWrapper;
