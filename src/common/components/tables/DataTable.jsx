import { Table, Text } from "@mantine/core";

function TableContainer({ scrollContainer, scrollContainerHeight, children }) {
  if (scrollContainer) {
    return (
      <Table.ScrollContainer maxHeight={scrollContainerHeight}>
        {children}
      </Table.ScrollContainer>
    );
  } else {
    return <>{children}</>;
  }
}

export default function DataTable({
  columns,
  removeId = false,
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
  scrollContainerHeight = "40vh",
}) {
  if (!data?.length) return <Text>{emptyMessage}</Text>;

  const filteredColumns = removeId
    ? columns.filter((column) => column.value.toLowerCase() !== "id")
    : columns;

  return (
    <TableContainer
      scrollContainer={scrollContainer}
      scrollContainerHeight={scrollContainerHeight}
    >
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
            {filteredColumns.map((column) => (
              <Table.Th
                key={column.value}
                style={
                  column?.type?.toLowerCase() === "actions-md"
                    ? { minWidth: "90px" }
                    : column?.type?.toLowerCase() === "actions-lg"
                    ? { minWidth: "100px" }
                    : {}
                }
              >
                {column.label}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{data.map((item) => renderRow(item))}</Table.Tbody>
      </Table>
    </TableContainer>
  );
}
