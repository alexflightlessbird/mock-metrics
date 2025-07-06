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
  editSchoolId,
  setEditSchoolId,
}) {
  const [editValues, setEditValues] = useState({});

  if (!assignments?.length)
    return <Text>No schools assigned to this user</Text>;

  const handleEditStart = (assignment) => {
    setEditSchoolId(assignment.school_id);
    setEditValues({
      role: assignment.role,
    });
  };

  const handleEditCancel = () => {
    setEditSchoolId(null);
    setEditValues({});
  };

  const handleEditSubmit = (id) => {
    onUpdate({ schoolId: id, role: editValues.role });
    setEditSchoolId(null);
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
            <Table.Tr key={assignment.school_id}>
              <Table.Td style={{ wordBreak: "break-all" }}>
                {assignment.school_id}
              </Table.Td>
              <Table.Td>
                {editSchoolId === assignment.school_id ? (
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
                  {editSchoolId === assignment.school_id ? (
                    <>
                      <ActionIcon
                        size="lg"
                        onClick={() => handleEditSubmit(assignment.school_id)}
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
                        onClick={() =>
                          onRemove({ schoolId: assignment.school_id })
                        }
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

export function AddAssignment({ availableSchools, onAdd, isLoading, setType }) {
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedRole, setSelectedRole] = useState("viewer");

  return (
    <Stack>
      <Select
        label="Select school to assign"
        placeholder="Search schools..."
        data={
          availableSchools?.map((school) => ({
            value: school.id,
            label: school.id,
          })) || []
        }
        value={selectedSchool}
        onChange={setSelectedSchool}
        searchable
        nothingFoundMessage="No schools found"
      />
      <Select
        data={roleOptions}
        allowDeselect={false}
        value={selectedRole}
        onChange={setSelectedRole}
        label="Role"
      />
      <Space h="xs" />
      <Button
        onClick={() => {
          if (selectedSchool && selectedRole) {
            onAdd({ schoolId: selectedSchool, role: selectedRole });
            setSelectedSchool(null);
            setSelectedRole("viewer");
            setType("view");
          }
        }}
        disabled={!selectedSchool}
        loading={isLoading}
      >
        Assign School
      </Button>
    </Stack>
  );
}
