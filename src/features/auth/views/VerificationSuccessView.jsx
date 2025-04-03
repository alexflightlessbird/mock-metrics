// Dependency imports
import { useNavigate } from "react-router-dom";
import { Text, useMantineTheme } from "@mantine/core";

// Component imports
import IconButton from "../../../common/components/IconButton";

export default function VerificationSuccessView() {
    const navigate = useNavigate();
    const theme = useMantineTheme();

    return (
        <>
            <h1>Email Verified</h1>
            <Text>Your email has been successfully verified. You can now log in to your account.</Text>
            <IconButton onClick={() => navigate("/auth")} icon="login" buttonText="Go to Login" variant="subtle" fontColor={theme.colors.primaryBlue[0]} />
        </>
    )
}
