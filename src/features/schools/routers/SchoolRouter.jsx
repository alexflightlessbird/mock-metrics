import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import AllSchoolsView from "../views/AllSchoolsView";
import SingleSchoolRouter from "./SingleSchoolRouter";
import NotFound from "../../../common/components/NotFound";
import { useSelectedItem } from "../../../common/hooks/useSelectedItem";

export default function SchoolRouter({ allSchools }) {
  const [searchParams] = useSearchParams();
  const schoolId = searchParams.get("schoolId");

  const selectedSchool = useSelectedItem({
    items: allSchools,
    itemIdName: "school_id",
    id: schoolId,
  });

  const [currentAllSchoolTab, setCurrentAllSchoolTab] = useState("primary");

  if (!schoolId)
    return (
      <AllSchoolsView
        allSchools={allSchools}
        currentAllSchoolTab={currentAllSchoolTab}
        setCurrentAllSchoolTab={setCurrentAllSchoolTab}
      />
    );

  if (schoolId && !selectedSchool) return <NotFound type="school" />;
  if (selectedSchool)
    return <SingleSchoolRouter selectedSchool={selectedSchool} />;
}
