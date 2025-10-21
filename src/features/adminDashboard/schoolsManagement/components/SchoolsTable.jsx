import { Checkbox, Table } from "@mantine/core";
import DataTable from "../../../../common/components/tables/DataTable";
import { EditDeleteTableActions } from "../../../../common/components/tables/TableActions";
import { useAuth } from "../../../../context/AuthContext";
import { SCHOOL_COLUMNS } from "../../common/columns";
import { useMobile } from "../../../../context/MobileContext";

export default function SchoolsTable({ data, onSelect }) {
  const { isDbManager } = useAuth();

  const { isMobile } = useMobile();

  const renderRow = (school) => (
    <Table.Tr key={school.id}>
      {!isMobile && (
        <Table.Td style={{ wordBreak: "break-all" }}>{school.id}</Table.Td>
      )}
      <Table.Td>{school.name || "-"}</Table.Td>
      <Table.Td>{school.short_name || "-"}</Table.Td>
      <Table.Td>
        <Checkbox checked={school.is_premium} readOnly tabIndex="-1" />
      </Table.Td>
      <Table.Td>
        <EditDeleteTableActions
          onDelete={() => onSelect(school, "delete")}
          onEdit={() => onSelect(school, "edit")}
          canDelete={isDbManager}
        />
      </Table.Td>
    </Table.Tr>
  );

  return (
    <DataTable
      columns={SCHOOL_COLUMNS}
      removeId={isMobile}
      data={data}
      emptyMessage="No schools available"
      renderRow={renderRow}
    />
  );
}
