import { Table, Button, Text, Stack } from "@mantine/core";
import { useState } from "react";
import {
  EditDeleteTableActions,
  ConfirmCancelTableActions,
} from "../../../../common/components/tables/TableActions";
import DataTable from "../../../../common/components/tables/DataTable";
import { ASSIGNMENT_COLUMNS } from "../../common/columns";
import DeleteConfirmationModal from "../../../../common/components/modals/DeleteConfirmationModal";
import { RoleField, SearchSelectField } from "../../common/FormFields";

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
          <RoleField
            value={editValues.role}
            onChange={(e) => setEditValues((v) => ({ ...v, role: e }))}
            label=""
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
        scrollContainer={true}
        scrollContainerHeight="30vh"
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

  if (!availableSchools?.length)
    return (
      <Text>
        No schools available that aren't already assigned to this user
      </Text>
    );

  return (
    <Stack>
      <SearchSelectField
        type="school"
        data={
          availableSchools?.map((s) => ({
            value: s.id,
            label: s.id,
          })) || []
        }
        value={selectedSchool}
        onChange={setSelectedSchool}
      />
      <RoleField value={selectedRole} onChange={setSelectedRole} />
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
