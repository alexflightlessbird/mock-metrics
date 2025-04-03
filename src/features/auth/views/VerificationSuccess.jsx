// Dependency imports
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Text } from "@mantine/core";

// Component imports
import IconButton from "../../../common/components/IconButton";

export default function VerificationSuccessView() {
    const navigate = useNavigate();

    return (
        <>
            <h1>Email Verified!</h1>
            <Text>Your email has been successfully verified. You can now log in to your account.</Text>
            <br />
            <IconButton onClick={() => navigate("/auth")} buttonText="Go to Login" />
        </>
    )
}
