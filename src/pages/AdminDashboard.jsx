import { useAuth } from "../context/AuthContext";
import { Tabs, Button, Title, Container, Group, Space } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import SchoolsManagement from "../features/adminDashboard/schoolsManagement/SchoolsManagement";
import CasesManagement from "../features/adminDashboard/casesManagement/CasesManagement";
import UsersManagement from "../features/adminDashboard/usersManagement/UsersManagement";

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <Container>
      <Title order={1}>Admin Dashboard</Title>
      <Space h="md" />
      <Group>
        <Button onClick={signOut}>Sign Out</Button>
        <Button onClick={() => navigate("/")}>User Dashboard</Button>
      </Group>
      <Space h="md" />

      <Container fluid px={0}>
        <Tabs defaultValue="schools">
          <Tabs.List>
            <Tabs.Tab value="schools">Schools</Tabs.Tab>
            <Tabs.Tab value="users">Users</Tabs.Tab>
            <Tabs.Tab value="cases">Cases</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="users">
            <UsersManagement />
          </Tabs.Panel>

          <Tabs.Panel value="schools">
            <SchoolsManagement />
          </Tabs.Panel>

          <Tabs.Panel value="cases">
            <CasesManagement />
          </Tabs.Panel>
        </Tabs>
      </Container>
    </Container>
  );
}
