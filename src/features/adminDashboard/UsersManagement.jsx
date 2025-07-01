import { useQuery } from "@tanstack/react-query";
import { Table, Space, Button } from "@mantine/core";
import { supabase } from "../../lib/supabase";
import { Loader } from "@mantine/core";

export default function UsersManagement() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("users").select("*");
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
          <Table.Th>Email</Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th>Last Updated</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {users.map((user) => (
          <Table.Tr key={user.id}>
            <Table.Td>{user.id}</Table.Td>
            <Table.Td>{user.email}</Table.Td>
            <Table.Td>{user.name || "-"}</Table.Td>
            <Table.Td>{new Date(user.updated_at).toLocaleString()}</Table.Td>
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
