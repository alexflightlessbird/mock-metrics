import { SCHOOL_COLUMNS } from "../common/columns";
import EntityManagement from "../common/EntityManagement";
import useSchoolsData from "./hooks/useSchoolsData";
import useSchoolsFilter from "./hooks/useSchoolsFilter";
import SchoolsTable from "./components/SchoolsTable";
import AddSchoolModal from "./components/AddSchoolModal";
import EditSchoolModal from "./components/EditSchoolModal";
import DeleteSchoolModal from "./components/DeleteSchoolModal";

export default function SchoolsManagement() {
  return (
    <EntityManagement
      entityName="school"
      columns={SCHOOL_COLUMNS}
      searchPlaceholder="Search schools..."
      useEntityData={useSchoolsData}
      useEntityFilter={useSchoolsFilter}
      TableComponent={SchoolsTable}
      AddModalComponent={AddSchoolModal}
      EditModalComponent={EditSchoolModal}
      DeleteModalComponent={DeleteSchoolModal}
    />
  );
}
