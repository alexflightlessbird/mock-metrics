import { Container, Title, Text, Button, Group } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function Error({ error, resetErrorBoundary }) {
    const navigate = useNavigate();

    return (
        <Container fluid>
            <Title order={1}>Something went wrong</Title>
            <Text c="red">{error?.message}</Text>
            <Group mt="md">
                <Button onClick={resetErrorBoundary}>Try again</Button>
                <Button onClick={() => navigate("/")} variant="outline">Return to Home</Button>
            </Group>
        </Container>
    )
}