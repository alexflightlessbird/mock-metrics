import { Navigate } from "react-router-dom";
import { useSession } from "../hooks/auth/useSession";
//loading spinner

function ProtectedRoute({ children, redirectPath = "/" }) {
  const { session, loading } = useSession();

  if (loading) {
    return <p>Loading...</p>;
  }
  if (!session) {
    return <Navigate to={redirectPath} replace />;
  }
  return children;
}

export default ProtectedRoute;
