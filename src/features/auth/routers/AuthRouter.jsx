// Dependency imports
import { useState } from "react";

// Component imports
import LoginView from "../views/LoginView";
import LogoutView from "../views/LogoutView";
import RegisterView from "../views/RegisterView";

export default function AuthRouter({ session }) {
    const [currentView, setCurrentView] = useState("login");

    if (!session) {
        return currentView === "login"
            ? <LoginView onToggleView={() => setCurrentView("register")} />
            : <RegisterView onToggleView={() => setCurrentView("login")} />;
    };
    
    return <LogoutView />;
}
