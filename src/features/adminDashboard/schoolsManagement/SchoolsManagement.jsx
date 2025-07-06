import { useState } from "react";
import { Container, Loader } from "@mantine/core";
import SearchControls from "./components/SearchControls";
import SchoolsTable from "./components/SchoolsTable";
import AddSchoolModal from "./components/AddSchoolModal";
import EditSchoolModal from "./components/EditSchoolModal";
import DeleteSchoolModal from "./components/DeleteSchoolModal";
import useSchoolsData from "./hooks/useSchoolsData";
import useSchoolsFilter from "./hooks/useSchoolsFilter";

const SCHOOL_COLUMNS = [
  { value: "id", label: "ID" },
  { value: "name", label: "Name" },
  { value: "short_name", label: "Short Name" },
];

export default function SchoolsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");

  const [selectedSchool, setSelectedSchool] = useState(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { schools, isLoading, addSchool, updateSchool, deleteSchool } =
    useSchoolsData();
  const filteredSchools = useSchoolsFilter({
    schools,
    searchTerm,
    searchColumn,
  });

  const handleSchoolSelect = (school, action) => {
    setSelectedSchool(school);
    switch (action) {
      case "edit":
        setEditModalOpen(true);
        break;
      case "delete":
        setDeleteModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleResetSearch = () => {
    setSearchTerm("");
    setSearchColumn("all");
  };

  if (isLoading) return <Loader mt="md" />;

  return (
    <Container fluid px={0}>
      <SearchControls
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search schools..."
        columns={SCHOOL_COLUMNS}
        selectedColumn={searchColumn}
        onColumnChange={setSearchColumn}
        onReset={handleResetSearch}
        onAdd={() => setAddModalOpen(true)}
      />

      <SchoolsTable
        schools={filteredSchools}
        onSelectSchool={handleSchoolSelect}
      />

      <AddSchoolModal
        opened={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={addSchool}
      />

      <EditSchoolModal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        school={selectedSchool}
        onSubmit={updateSchool}
      />

      <DeleteSchoolModal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        school={selectedSchool}
        onSubmit={deleteSchool}
      />
    </Container>
  );
}
