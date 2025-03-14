import { useSession } from "../../hooks/auth/useSession";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../common/loaders/LoadingSpinner";

export default function ProtectedRoute({ children }) {
  const { session, loading } = useSession();

  if (loading) {
    return <LoadingSpinner />;
  }
  if (!session) {
    return <Navigate to="/" replace />;
  }
  return children;
}
