// Dependency imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Group, Text } from "@mantine/core";

// Component imports
import IconButton from "../../../common/components/IconButton";

// Services imports
import { supabase } from "../../../services/supabaseClient";

export default function LogoutView() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    async function handleLogout () {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            navigate("/auth");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <h1>Logout</h1>
            <Text mb="md">Are you sure you want to log out?</Text>

            <Group>
                <IconButton onClick={handleLogout} icon="logout" buttonText="Logout" />
                <IconButton color="grey" onClick={() => navigate("/settings")} icon="close" buttonText="Cancel" />
            </Group>
        </>
    )
}
