// Component imports
import LoginView from "../views/LoginView";
import LogoutView from "../views/LogoutView";
import RegisterView from "../views/RegisterView";

export default function AuthRouter({ session }) {
    if (!session) return <LoginView />;
    return <LogoutView />;
}
