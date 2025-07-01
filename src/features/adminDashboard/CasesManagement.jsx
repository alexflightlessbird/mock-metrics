import { useQuery } from "@tanstack/react-query";
import { Table, Button, Space } from "@mantine/core";
import { supabase } from "../../lib/supabase";
import { Loader } from "@mantine/core";

export default function CasesManagement() {
  const { data: cases, isLoading } = useQuery({
    queryKey: ["admin-cases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cases")
        .select("*")
        .order("is_active", { ascending: false })
        .order("id");
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <Loader />;

  return (
    <Table
      striped
      highlightOnHover
      withTableBorder
      withColumnBorders
      style={{ cursor: "default" }}
    >
      <Table.Thead>
        <Table.Tr>
          <Table.Th>ID</Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th>Year</Table.Th>
          <Table.Th>Type</Table.Th>
          <Table.Th>Area</Table.Th>
          <Table.Th>Active</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {cases.map((caseItem) => (
          <Table.Tr key={caseItem.id}>
            <Table.Td>{caseItem.id}</Table.Td>
            <Table.Td>{caseItem.name || "-"}</Table.Td>
            <Table.Td>{caseItem.year || "-"}</Table.Td>
            <Table.Td>{caseItem.type || "-"}</Table.Td>
            <Table.Td>{caseItem.area || "-"}</Table.Td>
            <Table.Td>{caseItem.is_active ? "True" : "False"}</Table.Td>
            <Table.Td>
              <Button size="xs">Edit</Button>
              <Space h="xs" />
              <Button size="xs">Delete</Button>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
