// Dependency imports
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Text, useMantineTheme } from "@mantine/core";

// Component imports
import IconButton from "../../../common/components/IconButton";

export default function VerificationSuccessView() {
    const navigate = useNavigate();
    const theme = useMantineTheme();

    useEffect(() => {
        navigate("/auth?type=email-verification");
    }, []);

    return (
        <>
            <h1>Email Verified</h1>
            <Text>Your email has been successfully verified. You can now log in to your account.</Text>
            <br />
            <div>
                <IconButton onClick={() => navigate("/auth")} icon="login" buttonText="Go to Login" variant="outline" fontColor={theme.colors.primaryBlue[0]} />
            </div>
        </>
    )
}
