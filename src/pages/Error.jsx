import { Text, Button, Group } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import BasePage from "../common/components/BasePage";

export default function Error({ error, resetErrorBoundary }) {
  const navigate = useNavigate();

  return (
    <BasePage titleText="Something went wrong">
      <Text c="red">{error?.message}</Text>
      <Group mt="md">
        <Button onClick={resetErrorBoundary}>Try again</Button>
        <Button onClick={() => navigate("/")} variant="outline">
          Return to Home
        </Button>
      </Group>
    </BasePage>
  );
}
