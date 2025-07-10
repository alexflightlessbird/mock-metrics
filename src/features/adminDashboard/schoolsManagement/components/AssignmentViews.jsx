import { Table, Button, Text, Select, Stack, Space, List } from "@mantine/core";
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
  editUserId,
  setEditUserId,
  school,
}) {
  const [editValues, setEditValues] = useState({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteUserName, setDeleteUserName] = useState(null);

  if (!assignments?.length)
    return <Text>No users assigned to this school</Text>;

  const primaryAdminCount = assignments.reduce((acc, cur) => cur.role === "primary" ? ++acc : acc, 0);
  const adminCount = assignments.reduce((acc, cur) => cur.role === "admin" ? ++acc : acc, 0);
  const viewerCount = assignments.reduce((acc, cur) => cur.role === "viewer" ? ++acc : acc, 0);

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

  const handleDeleteStart = (assignment) => {
    setDeleteUserId(assignment.user_id);
    setDeleteUserName(assignment.users.name);
    setDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteUserId(null);
    setDeleteUserName(null);
  };

  const handleDeleteSubmit = (id) => {
    onRemove({ userId: id });
    setDeleteModalOpen(false);
    setDeleteUserId(null);
    setDeleteUserName(null);
  };

  const renderRow = (assignment) => (
    <Table.Tr key={assignment.user_id}>
      <Table.Td style={{ wordBreak: "break-all" }}>
        {assignment.user_id}
      </Table.Td>
      <Table.Td>
        {editUserId === assignment.user_id ? (
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
        {editUserId === assignment.user_id ? (
          <ConfirmCancelTableActions
            onCancel={handleEditCancel}
            onConfirm={() => handleEditSubmit(assignment.user_id)}
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
      {!school.is_premium && (
        <Stack gap="xs">
          <Text styles={{ paddingBottom: "0px", marginBottom: "0px" }}>School does not have premium status. Current assignments:</Text>
          <List withPadding>
            <List.Item>Primary Admins: {primaryAdminCount}</List.Item>
            <List.Item>Admins: {adminCount}</List.Item>
            <List.Item>Viewers: {viewerCount}</List.Item>
          </List>
        </Stack>
      )}
      <DataTable
        columns={ASSIGNMENT_COLUMNS}
        data={assignments}
        emptyMessage="No users assigned to this school"
        renderRow={renderRow}
        scrollContainer={true}
        scrollContainerHeight="30vh"
      />
      <DeleteConfirmationModal
        opened={deleteModalOpen}
        entityName="assignment"
        entity={{ id: deleteUserId, name: deleteUserName }}
        onClose={handleDeleteCancel}
        onSubmit={() => handleDeleteSubmit(deleteUserId)}
      />
    </>
  );
}

export function AddAssignment({ availableUsers, onAdd, isLoading, setType, school, assignments }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("viewer");
  
  if (!availableUsers?.length)
    return <Text>No users available that aren't already assigned to this school</Text>;

  const primaryAdminCount = assignments.reduce((acc, cur) => cur.role === "primary" ? ++acc : acc, 0);
  const adminCount = assignments.reduce((acc, cur) => cur.role === "admin" ? ++acc : acc, 0);
  const viewerCount = assignments.reduce((acc, cur) => cur.role === "viewer" ? ++acc : acc, 0);

  return (
    <>
      {!school.is_premium && (
        <Stack gap="xs">
          <Text styles={{ paddingBottom: "0px", marginBottom: "0px" }}>School does not have premium status. Current assignments:</Text>
          <List withPadding>
            <List.Item>Primary Admins: {primaryAdminCount}</List.Item>
            <List.Item>Admins: {adminCount}</List.Item>
            <List.Item>Viewers: {viewerCount}</List.Item>
          </List>
        </Stack>
      )}
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
    </>
  );
}
