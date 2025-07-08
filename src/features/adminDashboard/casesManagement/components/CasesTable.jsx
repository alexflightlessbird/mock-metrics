import { Checkbox, Table } from "@mantine/core";
import DataTable from "../../../../common/components/tables/DataTable";
import { EditDeleteTableActions } from "../../../../common/components/tables/TableActions";
import { useAuth } from "../../../../context/AuthContext";
import { CASE_COLUMNS } from "../../common/columns";
import { splitSlash as splitArea } from "../../../../common/utils/helpers";

export default function CasesTable({ data, onSelect }) {
  const { isDbManager } = useAuth();

  const renderRow = (caseVal) => (
    <Table.Tr key={caseVal.id}>
      <Table.Td>{caseVal.name || "-"}</Table.Td>
      <Table.Td>{caseVal.year || "-"}</Table.Td>
      <Table.Td>
        {caseVal.type
          ? caseVal.type.charAt(0).toUpperCase() + caseVal.type.slice(1)
          : "-"}
      </Table.Td>
      <Table.Td>{splitArea(caseVal.area)}</Table.Td>
      <Table.Td>
        <Checkbox checked={caseVal.is_active} readOnly />
      </Table.Td>
      <Table.Td>
        <EditDeleteTableActions
          onDelete={() => onSelect(caseVal, "delete")}
          onEdit={() => onSelect(caseVal, "edit")}
          canDelete={isDbManager}
        />
      </Table.Td>
    </Table.Tr>
  );

  return (
    <DataTable
      columns={CASE_COLUMNS}
      data={data}
      emptyMessage="No cases available"
      renderRow={renderRow}
    />
  );
}
