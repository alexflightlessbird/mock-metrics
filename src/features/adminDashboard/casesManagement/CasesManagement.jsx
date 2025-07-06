import { CASE_COLUMNS } from "../columns";
import EntityManagement from "../EntityManagement";
import useCasesData from "./hooks/useCasesData";
import useCasesFilter from "./hooks/useCasesFilter";
import CasesTable from "./components/CasesTable";
import AddCaseModal from "./components/AddCaseModal";
import EditCaseModal from "./components/EditCaseModal";
import DeleteCaseModal from "./components/DeleteCaseModal";

export default function CasesManagement() {
  return (
    <EntityManagement
      entityName="case"
      columns={CASE_COLUMNS}
      searchPlaceholder="Search cases..."
      useEntityData={useCasesData}
      useEntityFilter={useCasesFilter}
      TableComponent={CasesTable}
      AddModalComponent={AddCaseModal}
      EditModalComponent={EditCaseModal}
      DeleteModalComponent={DeleteCaseModal}
    />
  );
}
