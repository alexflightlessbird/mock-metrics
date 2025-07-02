import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, ActionIcon, Space, Container, Flex } from "@mantine/core";
import { supabase } from "../../lib/supabase";
import { Loader } from "@mantine/core";
import SearchBar from "../../common/components/SearchBar";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

const CASE_COLUMNS = [
  { value: "name", label: "Name" },
  { value: "year", label: "Year" },
  { value: "type", label: "Type" },
  { value: "area", label: "Area" }
];

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
  )
}

export default function CasesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");

  const onReset = () => {
    setSearchTerm("");
    setSearchColumn("all");
  }

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

  const filteredCases = useMemo(() => {
    if (!cases) return [];
    if (!searchTerm) return cases;

    const lowerSearchTerm = searchTerm.toLowerCase();

    if (searchColumn === "all") {
      return cases.filter(caseItem =>
        caseItem.name.toString().toLowerCase().includes(lowerSearchTerm) ||
        caseItem.year.toString().toLowerCase().includes(lowerSearchTerm) ||
        caseItem.type.toString().toLowerCase().includes(lowerSearchTerm) ||
        caseItem.area.toString().toLowerCase().includes(lowerSearchTerm)
      )
    } else {
      return cases.filter(caseItem =>
        String(caseItem[searchColumn]).toLowerCase().includes(lowerSearchTerm)
      )
    }
  }, [cases, searchTerm, searchColumn]);

  if (isLoading) return <Loader mt="md" />;

  return (
    <Container fluid px={0}>
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search cases..."
        columns={CASE_COLUMNS}
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
            <Table.Th>Name</Table.Th>
            <Table.Th>Year</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Area</Table.Th>
            <Table.Th>Active</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredCases.map((caseItem) => (
            <Table.Tr key={caseItem.id}>
              <Table.Td>{caseItem.name || "-"}</Table.Td>
              <Table.Td>{caseItem.year || "-"}</Table.Td>
              <Table.Td>{caseItem.type || "-"}</Table.Td>
              <Table.Td>{splitArea(caseItem.area)}</Table.Td>
              <Table.Td>{caseItem.is_active ? "True" : "False"}</Table.Td>
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
