import { Table, Text, Flex } from "@mantine/core";

export default function DataTable({
  columns,
  data,
  emptyMessage = "No data available",
  renderRow,
  striped = true,
  highlightOnHover = true,
  withTableBorder = true,
  withColumnBorders = true,
  stickyHeader = true,
  fontSize = "xs",
}) {
  if (!data?.length) return <Text>{emptyMessage}</Text>;

  return (
    <Table
      striped={striped}
      highlightOnHover={highlightOnHover}
      withTableBorder={withTableBorder}
      withColumnBorders={withColumnBorders}
      stickyHeader={stickyHeader}
      style={{ cursor: "default" }}
      fz={fontSize}
    >
      <Table.Thead>
        <Table.Tr>
          {columns.map((column) => (
            <Table.Th key={column.key}>{column.label}</Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{data.map((item) => renderRow(item))}</Table.Tbody>
    </Table>
  );
}
