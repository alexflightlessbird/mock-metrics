import { Tabs, Container } from "@mantine/core";
import SchoolsManagement from "../features/adminDashboard/schoolsManagement/SchoolsManagement";
import CasesManagement from "../features/adminDashboard/casesManagement/CasesManagement";
import UsersManagement from "../features/adminDashboard/usersManagement/UsersManagement";
import BasePage from "../common/components/BasePage";

export default function AdminDashboard() {
  return (
    <BasePage titleText="Admin Dashboard">
      <Container fluid px={0}>
        <Tabs defaultValue="schools" keepMounted={false}>
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
    </BasePage>
  );
}
