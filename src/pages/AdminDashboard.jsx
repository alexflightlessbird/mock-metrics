import { useAuth } from "../context/AuthContext";
import { Tabs } from "@mantine/core";
import UsersManagement from "../components/admin/UsersManagement";
import SchoolsManagement from "../components/admin/SchoolsManagement";

export default function AdminDashboard() {
    const { signOut } = useAuth();

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <button onClick={signOut}>Sign Out</button>

            <Tabs defaultValue="users">
                <Tabs.List>
                    <Tabs.Tab value="users">Users</Tabs.Tab>
                    <Tabs.Tab value="schools">Schools</Tabs.Tab>
                    <Tabs.Tab value="cases">Cases</Tabs.Tab>
                    <Tabs.Tab value="assignments">Assignments</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="users">
                    <UsersManagement />
                </Tabs.Panel>

                <Tabs.Panel value="schools">
                    <SchoolsManagement />
                </Tabs.Panel>
            </Tabs>
        </div>
    )
}