// Dependency imports
import { Text } from "@mantine/core";

// Component imports
import AllSchoolsTabs from "../components/tabs/AllSchoolsTabs";

// Hooks imports
import { useRoleFilters } from "../hooks/useRoleFilters";

export default function AllSchoolsView({
  allSchools,
  currentAllSchoolTab,
  setCurrentAllSchoolTab,
}) {
  const { primary: primarySchools, admin: adminSchools, viewer: viewerSchools } = useRoleFilters(allSchools);

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
