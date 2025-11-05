import { useEffect, useState } from "react";
import { useSchoolUsers } from "../../../common/hooks/useSchoolDetails";
import { List, Skeleton, Stack, Text, Title } from "@mantine/core";
import Loader from "../../../common/components/loader/GavelLoader";
import PageSection from "../../../common/components/PageSection";

export default function UsersSection({ schoolId }) {
    const [primaryAdmins, setPrimaryAdmins] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [viewers, setViewers] = useState([]);

    const { data: users = [], isLoading: usersLoading = true } = useSchoolUsers(schoolId);

    useEffect(() => {
        if (usersLoading) return;
        const primaryAdmins = users.filter(u => u.role === "primary");
        const admins = users.filter(u => u.role === "admin");
        const viewers = users.filter(u => u.role === "viewer");

        setPrimaryAdmins(primaryAdmins);
        setAdmins(admins);
        setViewers(viewers);
    }, [users, usersLoading]);

    if (usersLoading) return (
        <Stack>
            <Skeleton height={50} width="100%" />
            <Loader scale={1.5} />
        </Stack>
    );

    const UsersList = ({ users }) => {
        if (users.length > 0) return (
            <List>
                {users.map(u => (
                    <List.Item key={u.user_id}>
                        {u.users.name} ({u.users.email})
                    </List.Item>
                ))}
            </List>
        )
        return <Text c="dimmed">No users found</Text>
    };

    return (
        <PageSection title="users" collapsible>
            <Text>User management is not implemented yet.</Text>

            <Title order={4}>Primary Admins</Title>
            <UsersList users={primaryAdmins} />

            <Title order={4}>Admins</Title>
            <UsersList users={admins} />

            <Title order={4}>Viewers</Title>
            <UsersList users={viewers} />
        </PageSection>
    );
}