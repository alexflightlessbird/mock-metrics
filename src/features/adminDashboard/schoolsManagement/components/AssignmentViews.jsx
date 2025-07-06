import {
  Table,
  Button,
  Text,
  Select,
  Stack,
  Flex,
  ActionIcon,
  Space,
} from "@mantine/core";
import { useState } from "react";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineCheck,
  AiOutlineClose,
} from "react-icons/ai";

const roleOptions = [
  { value: "primary", label: "Primary Admin" },
  { value: "admin", label: "Admin" },
  { value: "viewer", label: "Viewer" },
];

export function ViewAssignments({
  assignments,
  onUpdate,
  onRemove,
  editUserId,
  setEditUserId,
}) {
  const [editValues, setEditValues] = useState({});

  if (!assignments?.length)
    return <Text>No users assigned to this school</Text>;

  const handleEditStart = (assignment) => {
    setEditUserId(assignment.user_id);
    setEditValues({
      role: assignment.role,
    });
  };

  const handleEditCancel = () => {
    setEditUserId(null);
    setEditValues({});
  };

  const handleEditSubmit = (id) => {
    onUpdate({ userId: id, role: editValues.role });
    setEditUserId(null);
    setEditValues({});
  };

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
          return (
            <Table.Tr key={assignment.user_id}>
              <Table.Td style={{ wordBreak: "break-all" }}>
                {assignment.user_id}
              </Table.Td>
              <Table.Td>
                {editUserId === assignment.user_id ? (
                  <Select
                    data={roleOptions}
                    value={editValues.role}
                    onChange={(value) =>
                      setEditValues((v) => ({ ...v, role: value }))
                    }
                  />
                ) : assignment.role === "admin" ? (
                  "Admin"
                ) : assignment.role === "primary" ? (
                  "Primary Admin"
                ) : assignment.role === "viewer" ? (
                  "Viewer"
                ) : (
                  "-"
                )}
              </Table.Td>
              <Table.Td>
                <Flex wrap="wrap" rowGap="xs" columnGap="xs">
                  {editUserId === assignment.user_id ? (
                    <>
                      <ActionIcon
                        size="lg"
                        onClick={() => handleEditSubmit(assignment.user_id)}
                      >
                        <AiOutlineCheck />
                      </ActionIcon>
                      <ActionIcon
                        color="gray"
                        size="lg"
                        onClick={handleEditCancel}
                      >
                        <AiOutlineClose />
                      </ActionIcon>
                    </>
                  ) : (
                    <>
                      <ActionIcon
                        size="lg"
                        onClick={() => handleEditStart(assignment)}
                      >
                        <AiOutlineEdit />
                      </ActionIcon>
                      <ActionIcon
                        size="lg"
                        onClick={() => onRemove({ userId: assignment.user_id })}
                      >
                        <AiOutlineDelete />
                      </ActionIcon>
                    </>
                  )}
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
