import { Navigate } from "react-router-dom";
import { useSession } from "../../hooks/auth/useSession";
//import Spin from "antd/es/spin";

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
