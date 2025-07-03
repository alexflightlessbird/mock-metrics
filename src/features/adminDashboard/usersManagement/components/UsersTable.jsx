import { Table, Flex, ActionIcon, Checkbox } from "@mantine/core";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

const splitEmail = (email) => {
    if (!email) return "-";
    const [localPart, domain] = email.split("@");

    return (
        <span>{localPart}<wbr />@{domain}</span>
    )
}

export default function UsersTable ({ users, onSelectUser }) {
    return (
        <Table
            striped
            highlightOnHover
            withTableBorder
            withColumnBorders
            stickyHeader
            style={{ cursor: "default" }}
            fz="xs"
        >
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Actions</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {users.map((user) => (
                    <Table.Tr key={user.id}>
                        <Table.Td style={{ wordBreak: "break-all" }}>{user.id}</Table.Td>
                        <Table.Td>{splitEmail(user.email)}</Table.Td>
                        <Table.Td>{user.name || "-"}</Table.Td>
                        <Table.Td>
                            <Flex wrap="wrap" rowGap="xs" columnGap="xs">
                                <ActionIcon size="md" onClick={() => onSelectUser(user, "edit")}>
                                    <AiOutlineEdit />
                                </ActionIcon>
                                <ActionIcon size="md" onClick={() => onSelectUser(user, "delete")}>
                                    <AiOutlineDelete />
                                </ActionIcon>
                            </Flex>
                        </Table.Td>
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
    )
}