import { useMemo } from "react";
import { Table, useMantineTheme } from "@mantine/core";
import DataTable from "../../../../common/components/tables/DataTable";
import { EditDeleteTableActions } from "../../../../common/components/tables/TableActions";
import { useAuth } from "../../../../context/AuthContext";
import { USER_COLUMNS } from "../../common/columns";
import { emToPx, splitEmail } from "../../../../common/utils/helpers";
import { useViewportSize } from "@mantine/hooks";

export default function UsersTable({ data, onSelect }) {
  const { isDbManager } = useAuth();
  const theme = useMantineTheme();
  const { width } = useViewportSize();

  const smBreakpointPx = useMemo(
    () => emToPx(parseFloat(theme.breakpoints.sm)),
    [theme.breakpoints.sm]
  );
  const isMobile = width < smBreakpointPx;

  const renderRow = (user) => (
    <Table.Tr key={user.id}>
      {!isMobile && (
        <Table.Td style={{ wordBreak: "break-all" }}>{user.id}</Table.Td>
      )}
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
      removeId={isMobile}
      columns={USER_COLUMNS}
      data={data}
      emptyMessage="No users available"
      renderRow={renderRow}
    />
  );
}
