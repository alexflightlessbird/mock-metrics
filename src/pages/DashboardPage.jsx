import { Container, Title, Button, Group, Space } from "@mantine/core";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { signOut, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <Container>
      <Title order={1}>User Dashboard</Title>
      <Space h="md" />
      <Group>
        <Button onClick={signOut}>Sign Out</Button>
        {isSuperAdmin && (
          <Button onClick={() => navigate("/admin")}>Admin Dashboard</Button>
        )}
      </Group>
    </Container>
  );
}
