import { useState, useEffect } from "react";
import { Box, Button, Group, Text } from "@mantine/core";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CookieBanner() {
    const [visible, setVisible] = useState(false);
    const { signOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const consentGiven = localStorage.getItem("cookieConsent");
        if (!consentGiven || consentGiven === null || consentGiven === "false") {
            setVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookieConsent", "true");
        setVisible(false);
    }

    const handleDecline = async () => {
        localStorage.setItem("cookieConsent", "false");
        setVisible(false);

        try {
            await signOut();
            localStorage.removeItem("supabase.auth.token");
            navigate("/");
        } catch (error) {
            console.error("Error during sign out:", error);
        }
        
        navigate("/");
    }

    if (!visible) return null;

    return (
        <Box
            style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "16px",
                backgroundColor: "#f8f9fa",
                borderTop: "1px solid #dee2e6",
                zIndex: 1000,
                boxShadow: "0 -2px 10px rgba(0,0,0,0.1)"
            }}
        >
            <Group>
                <Text size="sm">
                    We use cookies for authentication and essential site functions. By continuing to use our site, you consent to our use of cookies. For more information, visit <Text component="a" td="underline" style={{ cursor: "pointer" }} span onClick={() => navigate("/privacy-and-security")}>our Privacy Policy</Text>.
                </Text>
                <Group>
                    <Button variant="outline" size="xs" onClick={handleDecline}>Decline</Button>
                    <Button size="xs" onClick={handleAccept}>Accept</Button>
                </Group>
            </Group>
        </Box>
    )
}