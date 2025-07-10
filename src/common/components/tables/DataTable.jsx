import { Table, Text } from "@mantine/core";

function TableContainer({
  scrollContainer,
  scrollContainerHeight,
  children
}) {
  if (scrollContainer) {
    return (
      <Table.ScrollContainer maxHeight={scrollContainerHeight}>
        {children}
      </Table.ScrollContainer>
    )
  } else {
    return (
      <>
        {children}
      </>
    )
  }
}

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
  scrollContainer = false,
  scrollContainerHeight = "40vh"
}) {
  if (!data?.length) return <Text>{emptyMessage}</Text>;

  return (
      <TableContainer scrollContainer={scrollContainer} scrollContainerHeight={scrollContainerHeight}>
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
      </TableContainer>
  );
}
