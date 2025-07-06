import { Flex, ActionIcon, Checkbox, Table } from "@mantine/core";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import DataTable from "../../../../common/components/DataTable";
import { useAuth } from "../../../../context/AuthContext";

const splitArea = (area) => {
  if (!area) return "-";
  const parts = area.split("/");

  return (
    <span>
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 && (
            <>
              /
              <wbr />
            </>
          )}
        </span>
      ))}
    </span>
  );
};

const columns = [
  { key: "name", label: "Name" },
  { key: "year", label: "Year" },
  { key: "type", label: "Type" },
  { key: "area", label: "Area" },
  { key: "is_active", label: "Active" },
  { key: "actions", label: "Actions" },
];

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
        <Flex wrap="wrap" rowGap="xs" columnGap="xs">
          <ActionIcon size="md" onClick={() => onSelect(caseVal, "edit")}>
            <AiOutlineEdit />
          </ActionIcon>
          {isDbManager && (
            <ActionIcon size="md" onClick={() => onSelect(caseVal, "delete")}>
              <AiOutlineDelete />
            </ActionIcon>
          )}
        </Flex>
      </Table.Td>
    </Table.Tr>
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      emptyMessage="No cases available"
      renderRow={renderRow}
    />
  );
}
