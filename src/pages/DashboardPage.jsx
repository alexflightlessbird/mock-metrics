import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardPage () {
    const { signOut } = useAuth();
    const navigate = useNavigate();

    return (
        <div>
            <h1>Regular User</h1>
            <button onClick={signOut}>Sign Out</button>
            <button onClick={() => navigate('/admin')}>Admin Dashboard</button>
        </div>
    )
}