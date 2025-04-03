// Dependency imports
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

// Component imports
import LoginView from "../views/LoginView";
import LogoutView from "../views/LogoutView";
import RegisterView from "../views/RegisterView";
import VerificationSuccessView from "../views/VerificationSuccessView";

export default function AuthRouter({ session }) {
    const [currentView, setCurrentView] = useState("login");
    const [searchParams] = useSearchParams();
    const isVerificationSuccess = searchParams.get("type") === "email-verification";

    if (!session) {
        if (isVerificationSuccess) return <VerificationSuccessView />;
        
        switch (currentView) {
            case "login":
                return <LoginView onToggleView={() => setCurrentView("register")} />
            case "register":
                return <RegisterView onToggleView={() => setCurrentView("login")} />
            default:
                return <LoginView onToggleView={() => setCurrentView("register")} />
        }
    };
    
    return <LogoutView />;
}
