// Dependency imports
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

// Router imports
import SingleSchoolRouter from "./SingleSchoolRouter";

// Component imports
import AllSchoolsView from "../views/AllSchoolsView";
import NotFound from "../../../common/components/NotFound";

// Hooks imports
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
