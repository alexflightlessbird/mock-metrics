import { useState } from "react";
import { Container, Loader } from "@mantine/core";
import CasesTable from "./components/CasesTable";
import AddCaseModal from "./components/AddCaseModal";
import EditCaseModal from "./components/EditCaseModal";
import DeleteCaseModal from "./components/DeleteCaseModal";
import useCasesData from "./hooks/useCasesData";
import useCasesFilter from "./hooks/useCasesFilter";
import SearchBar from "../../../common/components/SearchBar";
import { CASE_COLUMNS } from "../columns";

export default function CasesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");

  const [selectedCase, setSelectedCase] = useState(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { cases, isLoading, addCase, updateCase, deleteCase } = useCasesData();
  const filteredCases = useCasesFilter({ cases, searchTerm, searchColumn });

  const handleCaseSelect = (caseVal, action) => {
    setSelectedCase(caseVal);
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
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search cases..."
        columns={CASE_COLUMNS}
        selectedColumn={searchColumn}
        onColumnChange={setSearchColumn}
        onReset={handleResetSearch}
        addEnabled={true}
        onAdd={() => setAddModalOpen(true)}
      />

      <CasesTable cases={filteredCases} onSelectCase={handleCaseSelect} />

      <AddCaseModal
        opened={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={addCase}
      />

      <EditCaseModal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        caseVal={selectedCase}
        onSubmit={updateCase}
      />

      <DeleteCaseModal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        caseVal={selectedCase}
        onSubmit={deleteCase}
      />
    </Container>
  );
}
