import { USER_COLUMNS } from "../common/columns";
import EntityManagement from "../common/EntityManagement";
import useUsersData from "./hooks/useUsersData";
import useUsersFilter from "./hooks/useUsersFilter";
import UsersTable from "./components/UsersTable";
import EditUserModal from "./components/EditUserModal";
import DeleteUserModal from "./components/DeleteUserModal";

export default function UsersManagement() {
  return (
    <EntityManagement
      entityName="user"
      columns={USER_COLUMNS}
      searchPlaceholder="Search users..."
      useEntityData={useUsersData}
      useEntityFilter={useUsersFilter}
      TableComponent={UsersTable}
      EditModalComponent={EditUserModal}
      DeleteModalComponent={DeleteUserModal}
      addEnabled={false}
    />
  );
}
