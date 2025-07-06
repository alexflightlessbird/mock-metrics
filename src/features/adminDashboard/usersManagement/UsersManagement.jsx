import { useState } from "react";
import { Container, Loader } from "@mantine/core";
import SearchControls from "./components/SearchControls";
import UsersTable from "./components/UsersTable";
import EditUserModal from "./components/EditUserModal";
import DeleteUserModal from "./components/DeleteUserModal";
import useUsersData from "./hooks/useUsersData";
import useUsersFilter from "./hooks/useUsersFilter";

const USER_COLUMNS = [
  { value: "id", label: "ID" },
  { value: "email", label: "Email" },
  { value: "name", label: "Name" },
];

export default function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");

  const [selectedUser, setSelectedUser] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { users, isLoading, updateUser, deleteUser } = useUsersData();
  const filteredUsers = useUsersFilter({ users, searchTerm, searchColumn });

  const handleUserSelect = (user, action) => {
    setSelectedUser(user);
    switch (action) {
      case "edit":
        setEditModalOpen(true);
        break;
      case "delete":
        setDeleteModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleResetSearch = () => {
    setSearchTerm("");
    setSearchColumn("all");
  };

  if (isLoading) return <Loader mt="md" />;

  return (
    <Container fluid px={0}>
      <SearchControls
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search users..."
        columns={USER_COLUMNS}
        selectedColumn={searchColumn}
        onColumnChange={setSearchColumn}
        onReset={handleResetSearch}
      />

      <UsersTable users={filteredUsers} onSelectUser={handleUserSelect} />

      <EditUserModal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={selectedUser}
        onSubmit={updateUser}
      />

      <DeleteUserModal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        user={selectedUser}
        onSubmit={deleteUser}
      />
    </Container>
  );
}
