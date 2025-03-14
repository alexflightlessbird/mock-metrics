import { useSession } from "../../context/SessionContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { session, loading } = useSession();

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!session) {
    return <Navigate to="/" replace />;
  }
  return children;
}
