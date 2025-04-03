// Dependency imports
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

// Component imports
import LoginView from "../views/LoginView";
import LogoutView from "../views/LogoutView";
import RegisterView from "../views/RegisterView";
import VerificationSuccessView from "../views/VerificationSuccessView";

export default function AuthRouter({ session }) {
    const [currentView, setCurrentView] = useState("login");
    const [searchParams] = useSearchParams();
    const isVerificationSuccess = searchParams.get("verified") === "true";

    useEffect(() => {
        if (isVerificationSuccess) {
            setCurrentView("verification-success");
        }
    }, [isVerificationSuccess]);

    if (!session) {
        switch (currentView) {
            case "login":
                return <LoginView onToggleView={() => setCurrentView("register")} />
            case "register":
                return <RegisterView onToggleView={() => setCurrentView("login")} />
            case "verification-success":
                return <VerificationSuccessView />;
            default:
                return <LoginView onToggleView={() => setCurrentView("register")} />
        }
    };
    
    return <LogoutView />;
}
