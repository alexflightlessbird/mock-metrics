import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Table, Radio, Modal, Container, Flex, ActionIcon, Group, TextInput, Space, Divider, Button, Checkbox, Input, Title, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { supabase } from "../../lib/supabase";
import { Loader } from "@mantine/core";
import { useState, useMemo } from "react";
import SearchBar from "../../common/components/SearchBar";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

const SCHOOL_COLUMNS = [
  { value: "id", label: "ID" },
  { value: "name", label: "Name" },
  { value: "short_name", label: "Short Name" }
];

export default function SchoolsManagement() {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editType, setEditType] = useState(null);
  const [editFormLoading, setEditFormLoading] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteFormLoading, setDeleteFormLoading] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addFormLoading, setAddFormLoading] = useState(false);
  const [addSchoolName, setAddSchoolName] = useState("");
  const [addSchoolShortName, setAddSchoolShortName] = useState("");
  const [addSchoolPremium, setAddSchoolPremium] = useState(false);
  
  const [selectedSchoolId, setSelectedSchoolId] = useState(null);
  const [selectedSchoolName, setSelectedSchoolName] = useState(null);
  const [selectedSchoolShortName, setSelectedSchoolShortName] = useState(null);
  const [selectedSchoolPremium, setSelectedSchoolPremium] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");

  const queryClient = useQueryClient();

  const onReset = () => {
    setSearchTerm("");
    setSearchColumn("all");
  }

  const showNotification = ({ title, message, color, position = "bottom-right" }) => {
    notifications.show({
      title,
      message,
      color,
      position
    })
  }

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

  const filteredSchools = useMemo(() => {
    if (!schools) return [];
    if (!searchTerm) return schools;

    const lowerSearchTerm = searchTerm.toLowerCase();

    if (searchColumn === "all") {
      return schools.filter(school =>
        school.id.toString().toLowerCase().includes(lowerSearchTerm) ||
        school.name.toString().toLowerCase().includes(lowerSearchTerm) ||
        school.short_name.toString().toLowerCase().includes(lowerSearchTerm)
      )
    } else {
      return schools.filter(school =>
        String(school[searchColumn]).toLowerCase().includes(lowerSearchTerm)
      )
    }
  }, [schools, searchTerm, searchColumn]);

  if (isLoading) return <Loader mt="md" />;

  const handleEditSubmit = async () => {
    setEditFormLoading(true);
    if (!selectedSchoolId) return;

    const selectedSchool = schools.find((s) => s.id === selectedSchoolId);

    try {
      const { error } = await supabase
        .from("schools")
        .update({
          ...(selectedSchoolName !== selectedSchool.name && { name: selectedSchoolName }),
          ...(selectedSchoolShortName !== selectedSchool.short_name && { short_name: selectedSchoolShortName }),
          ...(selectedSchoolPremium !== selectedSchool.is_premium && { is_premium: selectedSchoolPremium })
        })
        .eq("id", selectedSchoolId);

      if (error) throw error;

      queryClient.invalidateQueries(["admin-schools"]);

      showNotification({
        title: "Success",
        message: "School updated successfully",
        color: "green"
      })
    } catch (error) {
      showNotification({
        title: "Update failed",
        message: error.message || "Failed to update school",
        color: "red"
      })
    } finally {
      setEditModalOpen(false);
      setEditFormLoading(false);
    }
  }

  const handleDeleteSubmit = async () => {
    setDeleteFormLoading(true);
    if (!selectedSchoolId) return;

    try {
      const { error } = await supabase
        .from("schools")
        .delete()
        .eq("id", selectedSchoolId);
      
      if (error) throw error;

      queryClient.invalidateQueries(["admin-schools"]);

      showNotification({
        title: "Success",
        message: "School deleted successfully",
        color: "green"
      })
    } catch (error) {
      showNotification({
        title: "Delete failed",
        message: error.message || "Failed to delete school",
        color: "red",
      })
    } finally {
      setDeleteModalOpen(false);
      setDeleteFormLoading(false);
    }
  }

  const handleAddSubmit = async () => {
    setAddFormLoading(true);

    if (addSchoolName?.length === 0 || addSchoolName === null || addSchoolName === "") {setAddFormLoading(false); return;}
    if (addSchoolShortName?.length === 0 || addSchoolShortName === null || addSchoolShortName === "") {setAddFormLoading(false); return;};

    try {
      const { error } = await supabase
        .from("schools")
        .insert({
          name: addSchoolName,
          short_name: addSchoolShortName,
          is_premium: addSchoolPremium
        });

      if (error) throw error;

      queryClient.invalidateQueries(["admin-schools"]);

      showNotification({
        title: "Success",
        message: "School added successfully",
        color: "green"
      })
    } catch (error) {
      showNotification({
        title: "Add failed",
        message: error.message || "Failed to add school",
        color: "red"
      })
    } finally {
      setAddModalOpen(false);
      setAddFormLoading(false);
    }
  }

  return (
    <>
    <Container fluid px={0}>
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search schools..."
        columns={SCHOOL_COLUMNS}
        selectedColumn={searchColumn}
        onColumnChange={setSearchColumn}
        onReset={onReset}
        addEnabled={true}
        onAdd={() => {
          setAddSchoolName("");
          setAddSchoolShortName("");
          setAddSchoolPremium(false);
          setAddModalOpen(true);
        }}
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
            <Table.Th>Name</Table.Th>
            <Table.Th>Short Name</Table.Th>
            <Table.Th>Premium</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredSchools.map((school) => (
            <Table.Tr key={school.id}>
              <Table.Td style={{ wordBreak: "break-all" }}>{school.id}</Table.Td>
              <Table.Td>{school.name || "-"}</Table.Td>
              <Table.Td>{school.short_name || "-"}</Table.Td>
              <Table.Td>
                {school.is_premium === true ? "True" : "False"}
              </Table.Td>
              <Table.Td>
                <Flex wrap={"wrap"} rowGap="xs" columnGap="xs">
                  <ActionIcon 
                    size="md" 
                    onClick={() => {
                      setSelectedSchoolId(school.id);
                      setEditType(null);
                      setSelectedSchoolName(school.name || "");
                      setSelectedSchoolShortName(school.short_name || "");
                      setSelectedSchoolPremium(school.is_premium ? true : false);
                      setEditFormLoading(false);
                      setEditModalOpen(true);
                    }}
                  >
                    <AiOutlineEdit />
                  </ActionIcon>
                  <ActionIcon 
                    size="md"
                    onClick={() => {
                      setSelectedSchoolId(school.id);
                      setSelectedSchoolName(school.name || "");
                      setSelectedSchoolShortName(school.short_name || "");
                      setDeleteFormLoading(false);
                      setDeleteModalOpen(true);
                    }}
                  >
                    <AiOutlineDelete />
                  </ActionIcon>
                </Flex>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Container>
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit School (${selectedSchoolName})`}
        centered
        withCloseButton
        overlayProps={{
          backgroundOpacity: 0.4,
          blur: 3,
        }}
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          handleEditSubmit();
        }}>
          <Radio.Group
            name="editOption"
            label="Choose what you want to edit"
            withAsterisk
            value={editType}
            onChange={setEditType}
          >
            <Group>
              <Radio value="detail" label="School Details" data-autofocus />
              <Radio value="assignment" label="School Assignments" />
            </Group>
          </Radio.Group>
          {editType !== null && (
            <>
              <Space h="md" />
              <Divider />
              <Space h="sm" />
            </>
          )}
          {editType === "detail" && (
            <>
              <TextInput
                value={selectedSchoolName}
                onChange={(e) => setSelectedSchoolName(e.target.value)}
                label="School Name"
              />
              <Space h="xs" />
              <TextInput
                value={selectedSchoolShortName}
                onChange={(e) => setSelectedSchoolShortName(e.target.value)}
                label="School Short Name"
              />
              <Input.Wrapper label="Premium Status" />
              <Checkbox
                checked={selectedSchoolPremium} 
                onChange={(e) => setSelectedSchoolPremium(e.target.checked)}
                label={`${selectedSchoolPremium ? "Active" : "Inactive"}`} 
              />
              <Space h="xs" />
              <Button type="submit" loading={editFormLoading}>Submit</Button>
            </>
          )}
          {editType === "assignment" && (
            <p>Test = Assignment</p>
          )}
        </form>
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
        <Text>Woah, hold up! Are you sure you want to delete {selectedSchoolName || ""}?</Text>
        <Text fz="xs">This action cannot be reversed and will permanently remove all information associated with the school.</Text>
        <Space h="sm" />
        <Flex direction="row" align="center" justify="space-between">
          <Button 
            color="red" 
            w="45%"
            onClick={handleDeleteSubmit}
            loading={deleteFormLoading}
          >
            Delete{selectedSchoolShortName?.length > 0 ? " " + selectedSchoolShortName : ""}
          </Button>
          <Button 
          data-autofocus
            color="gray" 
            w="45%" 
            onClick={() => {
              setSelectedSchoolId(null);
              setDeleteModalOpen(false);
            }}
            loading={deleteFormLoading}
          >
            Cancel
          </Button>
        </Flex>
      </Modal>
      <Modal
        opened={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add School"
        centered
        withCloseButton
        overlayProps={{
          backgroundOpacity: 0.4,
          blur: 3,
        }}
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          handleAddSubmit();
        }}
        >
          <TextInput
            value={addSchoolName}
            onChange={(e) => setAddSchoolName(e.target.value)}
            label="School Name"
          />
          <Space h="xs" />
          <TextInput
            value={addSchoolShortName}
            onChange={(e) => setAddSchoolShortName(e.target.value)}
            label="School Short Name"
          />
          <Input.Wrapper label="Premium Status" />
          <Checkbox
            checked={addSchoolPremium} 
            onChange={(e) => setAddSchoolPremium(e.target.checked)}
            label={`${addSchoolPremium ? "Active" : "Inactive"}`} 
          />
          <Space h="xs" />
          <Button type="submit" loading={addFormLoading}>Submit</Button>
        </form>
      </Modal>
    </>
  );
}
