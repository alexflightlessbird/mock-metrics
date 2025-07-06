import { Table, Flex, ActionIcon, Checkbox } from "@mantine/core";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

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

export default function SchoolsTable({ cases, onSelectCase }) {
  return (
    <Table
      striped
      highlightOnHover
      withTableBorder
      withColumnBorders
      stickyHeader
      style={{ cursor: "default" }}
      fz="xs"
    >
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Year</Table.Th>
          <Table.Th>Type</Table.Th>
          <Table.Th>Area</Table.Th>
          <Table.Th>Active</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {cases.map((caseVal) => (
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
              {caseVal.is_active ? (
                <Checkbox checked readOnly />
              ) : (
                <Checkbox checked={false} readOnly />
              )}
            </Table.Td>
            <Table.Td>
              <Flex wrap="wrap" rowGap="xs" columnGap="xs">
                <ActionIcon
                  size="md"
                  onClick={() => onSelectCase(caseVal, "edit")}
                >
                  <AiOutlineEdit />
                </ActionIcon>
                <ActionIcon
                  size="md"
                  onClick={() => onSelectCase(caseVal, "delete")}
                >
                  <AiOutlineDelete />
                </ActionIcon>
              </Flex>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
