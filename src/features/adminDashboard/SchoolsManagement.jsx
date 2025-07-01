import { useQuery } from "@tanstack/react-query";
import { Table, Button, Space, Modal } from "@mantine/core";
import { supabase } from "../../lib/supabase";
import { Loader } from "@mantine/core";
import { useState } from "react";

export default function SchoolsManagement() {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState(null);

  const { data: schools, isLoading } = useQuery({
    queryKey: ["admin-schools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <Loader />;

  return (
    <>
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
            <Table.Th>Short Name</Table.Th>
            <Table.Th>Premium</Table.Th>
            <Table.Th>Last Updated</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {schools.map((school) => (
            <Table.Tr key={school.id}>
              <Table.Td>{school.id}</Table.Td>
              <Table.Td>{school.name || "-"}</Table.Td>
              <Table.Td>{school.short_name || "-"}</Table.Td>
              <Table.Td>
                {school.is_premium === true ? "True" : "False"}
              </Table.Td>
              <Table.Td>
                {new Date(school.updated_at).toLocaleString()}
              </Table.Td>
              <Table.Td>
                <Button
                  size="xs"
                  onClick={() => {
                    setSelectedSchoolId(school.id);
                    setEditModalOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Space h="xs" />
                <Button
                  size="xs"
                  onClick={() => {
                    setSelectedSchoolId(school.id);
                    setDeleteModalOpen(true);
                  }}
                >
                  Delete
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit School"
        centered
        withCloseButton
        overlayProps={{
          backgroundOpacity: 0.4,
          blur: 3,
        }}
      >
        <p>Edit form for school ID: {selectedSchoolId}</p>
      </Modal>
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete School"
        centered
        withCloseButton
        overlayProps={{
          backgroundOpacity: 0.4,
          blur: 3,
        }}
      >
        <p>Delete form for school ID: {selectedSchoolId}</p>
      </Modal>
    </>
  );
}
