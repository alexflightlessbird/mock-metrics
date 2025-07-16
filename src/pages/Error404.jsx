import { Container, Title, Text, Button, Center, Stack, Flex } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function Error404() {
    const navigate = useNavigate();

    return (
        <Container fluid>
            <Flex direction="column" justify="center" mih="calc(100vh - var(--app-shell-header-height) - var(--app-shell-header-offset)/2)" align="center">
                <Title order={1}>404 - Page Not Found</Title>
                <Text>The page you're looking for doesn't exist.</Text>
                <Button onClick={() => navigate("/")} mt="md">
                    Return to Home
                </Button>
            </Flex>
        </Container>
    )
}