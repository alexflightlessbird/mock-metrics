// Dependency imports
import { Navigate } from "react-router-dom";

// Hooks imports
import { useSession } from "../../common/hooks/auth/useSession";

export default function ProtectedRoute({ children, redirectPath = "/" }) {
  const { session, loading } = useSession();

  if (loading) {
    return;
  }
  if (!session) {
    return <Navigate to={redirectPath} replace />;
  }
  return children;
}
