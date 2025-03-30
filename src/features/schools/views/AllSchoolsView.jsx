import { Link } from "react-router-dom";
import AllSchoolsTabs from "../components/tabs/AllSchoolsTabs";
import { Text } from "@mantine/core";
import { useSchoolFilters } from "../hooks/useSchoolFilters";

export default function AllSchoolsView({
  allSchools,
  currentAllSchoolTab,
  setCurrentAllSchoolTab,
}) {
  const [primarySchools, adminSchools, viewerSchools] =
    useSchoolFilters(allSchools);
  return (
    <>
      <h1>Schools</h1>
      <Text>
        If you need to be added to a school, please have the school's primary
        admin contact MSU Mock Trial.
      </Text>
      <br />
      <h2>All Schools</h2>
      <AllSchoolsTabs
        primarySchools={primarySchools}
        adminSchools={adminSchools}
        viewerSchools={viewerSchools}
        currentTab={currentAllSchoolTab}
        setCurrentTab={setCurrentAllSchoolTab}
      />
    </>
  );
}
