import { Container, Title, Text, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function Error404() {
    const navigate = useNavigate();

    return (
        <Container>
            <Title order={1}>404 - Page Not Found</Title>
            <Text>The page you're looking for doesn't exist.</Text>
            <Button onClick={() => navigate("/")} mt="md">
                Return to Home
            </Button>
        </Container>
    )
}