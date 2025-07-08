import { Table, Button, Text, Select, Stack, Space } from "@mantine/core";
import { useState } from "react";
import {
  EditDeleteTableActions,
  ConfirmCancelTableActions,
} from "../../../../common/components/tables/TableActions";
import DataTable from "../../../../common/components/tables/DataTable";
import { ASSIGNMENT_COLUMNS } from "../../common/columns";
import DeleteConfirmationModal from "../../../../common/components/modals/DeleteConfirmationModal";

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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteSchoolId, setDeleteSchoolId] = useState(null);
  const [deleteSchoolName, setDeleteSchoolName] = useState(null);

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

  const handleDeleteStart = (assignment) => {
    setDeleteSchoolId(assignment.school_id);
    setDeleteSchoolName(assignment.schools.name);
    setDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteSchoolId(null);
    setDeleteSchoolName(null);
  };

  const handleDeleteSubmit = (id) => {
    onRemove({ schoolId: id });
    setDeleteModalOpen(false);
    setDeleteSchoolId(null);
    setDeleteSchoolName(null);
  };

  const renderRow = (assignment) => (
    <Table.Tr key={assignment.school_id}>
      <Table.Td style={{ wordBreak: "break-all" }}>
        {assignment.school_id}
      </Table.Td>
      <Table.Td>
        {editSchoolId === assignment.school_id ? (
          <Select
            data={roleOptions}
            value={editValues.role}
            onChange={(value) => setEditValues((v) => ({ ...v, role: value }))}
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
        {editSchoolId === assignment.school_id ? (
          <ConfirmCancelTableActions
            onCancel={handleEditCancel}
            onConfirm={() => handleEditSubmit(assignment.school_id)}
            size="lg"
          />
        ) : (
          <EditDeleteTableActions
            onDelete={() => handleDeleteStart(assignment)}
            onEdit={() => handleEditStart(assignment)}
            size="lg"
            canDelete={true}
          />
        )}
      </Table.Td>
    </Table.Tr>
  );

  return (
    <>
      <DataTable
        columns={ASSIGNMENT_COLUMNS}
        data={assignments}
        emptyMessage="No schools assigned to this user"
        renderRow={renderRow}
      />
      <DeleteConfirmationModal
        opened={deleteModalOpen}
        entityName="assignment"
        entity={{ id: deleteSchoolId, name: deleteSchoolName }}
        onClose={handleDeleteCancel}
        onSubmit={() => handleDeleteSubmit(deleteSchoolId)}
      />
    </>
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
