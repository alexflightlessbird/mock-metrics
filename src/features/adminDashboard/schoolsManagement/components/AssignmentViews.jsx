import {
  Table,
  Radio,
  Group,
  Button,
  Text,
  Select,
  Stack,
  Flex,
  ActionIcon,
  Space,
} from "@mantine/core";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

export function ViewAssignments({
  assignments,
  onUpdate,
  onRemove,
  editOpen,
  setEditOpen,
  editUserId,
}) {
  if (!assignments?.length)
    return <Text>No users assigned to this school</Text>;

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
        {assignments.map((assignment) => {
          const editIconProps = {
            color: "blue",
            variant: "filled",
          };
          if (editUserId && editUserId === assignment.user_id && editOpen) {
            editIconProps.variant = "outline";
          }
          return (
            <Table.Tr key={assignment.user_id}>
              <Table.Td>{assignment.user_id}</Table.Td>
              <Table.Td>
                {assignment.role === "admin"
                  ? "Admin"
                  : assignment.role === "primary"
                  ? "Primary Admin"
                  : assignment.role === "viewer"
                  ? "Viewer"
                  : "-"}
              </Table.Td>
              <Table.Td>
                <Flex wrap="wrap" rowGap="xs" columnGap="xs">
                  <ActionIcon
                    size="lg"
                    color={editIconProps.color}
                    variant={editIconProps.variant}
                    onClick={() => {
                      if (editOpen) {
                        setEditOpen(false);
                      } else {
                        onUpdate({
                          userId: assignment.user_id,
                          role: assignment.role,
                        });
                      }
                    }}
                  >
                    <AiOutlineEdit />
                  </ActionIcon>
                  <ActionIcon
                    size="lg"
                    onClick={() => onRemove({ userId: assignment.user_id })}
                  >
                    <AiOutlineDelete />
                  </ActionIcon>
                </Flex>
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
}

export function AddAssignment({ availableUsers, onAdd, isLoading, setType }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("viewer");

  return (
    <Stack>
      <Select
        label="Select user to assign"
        placeholder="Search users..."
        data={
          availableUsers?.map((user) => ({
            value: user.id,
            label: user.id,
          })) || []
        }
        value={selectedUser}
        onChange={setSelectedUser}
        searchable
        nothingFoundMessage="No users found"
      />
      <Select
        data={[
          { value: "primary", label: "Primary Admin" },
          { value: "admin", label: "Admin" },
          { value: "viewer", label: "Viewer" },
        ]}
        allowDeselect={false}
        value={selectedRole}
        onChange={setSelectedRole}
        label="Role"
      />
      <Space h="xs" />
      <Button
        onClick={() => {
          if (selectedUser && selectedRole) {
            onAdd({ userId: selectedUser, role: selectedRole });
            setSelectedUser(null);
            setSelectedRole("viewer");
            setType("view");
          }
        }}
        disabled={!selectedUser}
        loading={isLoading}
      >
        Assign User
      </Button>
    </Stack>
  );
}
