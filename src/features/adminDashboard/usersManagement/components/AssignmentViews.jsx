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
  editSchoolId,
}) {
  if (!assignments?.length)
    return <Text>No schools assigned to this user</Text>;

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
          if (
            editSchoolId &&
            editSchoolId === assignment.school_id &&
            editOpen
          ) {
            editIconProps.variant = "outline";
          }
          return (
            <Table.Tr key={assignment.school_id}>
              <Table.Td>{assignment.school_id}</Table.Td>
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
                          schoolId: assignment.school_id,
                          role: assignment.role,
                        });
                      }
                    }}
                  >
                    <AiOutlineEdit />
                  </ActionIcon>
                  <ActionIcon
                    size="lg"
                    onClick={() => onRemove({ schoolId: assignment.school_id })}
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
