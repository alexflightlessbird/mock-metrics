import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, Space, Button, Container, Flex, ActionIcon } from "@mantine/core";
import { supabase } from "../../lib/supabase";
import { Loader } from "@mantine/core";
import SearchBar from "../../common/components/SearchBar";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

const USER_COLUMNS = [
  { value: "id", label: "ID" },
  { value: "name", label: "Name" },
  { value: "email", label: "Email" }
];

const splitEmail = (email) => {
  const [localPart, domain] = email.split("@");

  return (
    <span>{localPart}<wbr />@{domain}</span>
  )
}

export default function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");

  const onReset = () => {
    setSearchTerm("");
    setSearchColumn("all");
  }
  
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("users").select("*");
      if (error) throw error;
      return data;
    },
  });

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!searchTerm) return users;

    const lowerSearchTerm = searchTerm.toLowerCase();

    if (searchColumn === "all") {
      return users.filter(user =>
        user.id.toString().toLowerCase().includes(lowerSearchTerm) ||
        user.email.toString().toLowerCase().includes(lowerSearchTerm) ||
        user.name.toString().toLowerCase().includes(lowerSearchTerm)
      )
    } else {
      return users.filter(user =>
        String(user[searchColumn]).toLowerCase().includes(lowerSearchTerm)
      )
    }
  }, [users, searchTerm, searchColumn]);

  if (isLoading) return <Loader mt="md" />;

  return (
    <Container fluid px={0}>
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search users..."
        columns={USER_COLUMNS}
        selectedColumn={searchColumn}
        onColumnChange={setSearchColumn}
        onReset={onReset}
      />
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
            <Table.Th>ID</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredUsers.map((user) => (
            <Table.Tr key={user.id}>
              <Table.Td style={{ wordBreak: "break-all" }}>{user.id}</Table.Td>
              <Table.Td>{splitEmail(user.email)}</Table.Td>
              <Table.Td>{user.name || "-"}</Table.Td>
              <Table.Td>
                <Flex wrap={"wrap"} rowGap="xs" columnGap="xs">
                  <ActionIcon size="md"><AiOutlineEdit /></ActionIcon>
                  <ActionIcon size="md"><AiOutlineDelete /></ActionIcon>
                </Flex>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Container>
  );
}
