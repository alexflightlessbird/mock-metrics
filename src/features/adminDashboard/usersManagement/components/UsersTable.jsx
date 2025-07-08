import { Table } from "@mantine/core";
import DataTable from "../../../../common/components/tables/DataTable";
import { EditDeleteTableActions } from "../../../../common/components/tables/TableActions";
import { useAuth } from "../../../../context/AuthContext";
import { USER_COLUMNS } from "../../common/columns";
import { splitEmail } from "../../../../common/utils/helpers";

export default function UsersTable({ data, onSelect }) {
  const { isDbManager } = useAuth();

  const renderRow = (user) => (
    <Table.Tr key={user.id}>
      <Table.Td style={{ wordBreak: "break-all" }}>{user.id}</Table.Td>
      <Table.Td>{splitEmail(user.email)}</Table.Td>
      <Table.Td>{user.name || "-"}</Table.Td>
      <Table.Td>
        <EditDeleteTableActions
          onDelete={() => onSelect(user, "delete")}
          onEdit={() => onSelect(user, "edit")}
          canDelete={isDbManager}
        />
      </Table.Td>
    </Table.Tr>
  );

  return (
    <DataTable
      columns={USER_COLUMNS}
      data={data}
      emptyMessage="No users available"
      renderRow={renderRow}
    />
  );
}
