import { Flex, ActionIcon, Checkbox, Table } from "@mantine/core";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import DataTable from "../../../../common/components/DataTable";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "short_name", label: "Short Name" },
  { key: "is_premium", label: "Premium" },
  { key: "actions", label: "Actions" },
];

export default function SchoolsTable({ schools, onSelectSchool }) {
  const renderRow = (school) => (
    <Table.Tr key={school.id}>
      <Table.Td style={{ wordBreak: "break-all" }}>{school.id}</Table.Td>
      <Table.Td>{school.name || "-"}</Table.Td>
      <Table.Td>{school.short_name || "-"}</Table.Td>
      <Table.Td>
        <Checkbox checked={school.is_premium} readOnly />
      </Table.Td>
      <Table.Td>
        <Flex wrap="wrap" rowGap="xs" columnGap="xs">
          <ActionIcon size="md" onClick={() => onSelectSchool(school, "edit")}>
            <AiOutlineEdit />
          </ActionIcon>
          <ActionIcon
            size="md"
            onClick={() => onSelectSchool(school, "delete")}
          >
            <AiOutlineDelete />
          </ActionIcon>
        </Flex>
      </Table.Td>
    </Table.Tr>
  );

  return (
    <DataTable
      columns={columns}
      data={schools}
      emptyMessage="No schools available"
      renderRow={renderRow}
    />
  );
}
