import { Table, Radio, Group, Button, Text, Select, Stack, Flex, ActionIcon, Space } from "@mantine/core";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

export function ViewAssignments({ assignments, onUpdate, onRemove }) {
    if (!assignments?.length) return <Text>No users assigned to this school</Text>;

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
                    <Table.Th>Role</Table.Th>
                    <Table.Th>Actions</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {assignments.map((assignment) => (
                    <Table.Tr key={assignment.user_id}>
                        <Table.Td>{assignment.user_id}</Table.Td>
                        <Table.Td>{assignment.role || "-"}</Table.Td>
                        <Table.Td>
                            <Flex wrap="wrap" rowGap="xs" columnGap="xs">
                                <ActionIcon size="md" onClick={() => onUpdate(assignment.user_id)}>
                                    <AiOutlineEdit />
                                </ActionIcon> 
                                <ActionIcon size="md" onClick={() => onRemove(assignment.user_id)}>
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


export function AddAssignment ({ availableUsers, onAdd, isLoading }) {
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState("viewer");

    return (
        <Stack>
            <Select 
                label="Select user to assign"
                placeholder="Search users..."
                data={availableUsers?.map(user => ({
                    value: user.id,
                    label: user.id
                })) || []}
                value={selectedUser}
                onChange={setSelectedUser}
                searchable
                nothingFoundMessage="No users found"
            />
            <Space h="xs" />
            <Select 
                data={[
                    { value: "primary", label: "Primary Admin" },
                    { value: "admin", label: "Admin" },
                    { value: "viewer", label: "Viewer" }
                ]}
                allowDeselect={false}
                value={selectedRole}
                onChange={setSelectedRole}
                label="Role"
            />
            {/* CONTINUE HERE */}
        </Stack>
    )
}