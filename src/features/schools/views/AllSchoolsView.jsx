// Dependency imports
import { useSearchParams } from "react-router-dom";
import { Text, SegmentedControl } from "@mantine/core";

// Component imports
import SchoolList from "../components/lists/AllSchools/SchoolList";

// Hooks imports
import { useRoleFilters } from "../hooks/useRoleFilters";

export default function AllSchoolsView({
  allSchools
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { primary: primarySchools, admin: adminSchools, viewer: viewerSchools } = useRoleFilters(allSchools);

  const filter = searchParams.get("filter") || "all";

  const handleFilterChange = (newFilter) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("filter", newFilter);
    setSearchParams(newSearchParams);
  };

  const getFilteredSchools = () => {
    switch (filter) {
      case "primary": return primarySchools;
      case "admin": return adminSchools;
      case "viewer": return viewerSchools;
      case "all":
      default: return [...primarySchools, ...adminSchools, ...viewerSchools];
    }
  };

  const filterOptions = [
    { label: "All", value: "all" },
    ...(primarySchools.length > 0 ? 
      [{ label: "Primary Admin", value: "primary" }] :
      [{ label: "Primary Admin", value: "primary", disabled: true }]
    ),
    ...(adminSchools.length > 0 ?
      [{ label: "Admin", value: "admin" }] :
      [{ label: "Admin", value: "admin", disabled: true }]
    ),
    ...(viewerSchools.length > 0 ? 
      [{ label: "Viewer", value: "viewer" }] :
      [{ label: "Viewer", value: "viewer", disabled: true }]
    )
  ];

  const currentFilter = 
    (filter === "primary" && primarySchools.length === 0) || 
    (filter === "admin" && adminSchools.length === 0) ||
    (filter === "viewer" && viewerSchools.length === 0) ?
    "all" : filter;

  return (
    <>
      <h1>Schools</h1>
      <Text>
        If you need to be added to a school, please have the school's primary
        admin contact MSU Mock Trial.
      </Text>
      <br />
      <h2>All Schools</h2>
      <SegmentedControl
        value={currentFilter}
        onChange={handleFilterChange}
        data={filterOptions}
        mb="md"
        disabled={allSchools.length > 0 ? false : true}
      />
      <SchoolList schools={getFilteredSchools()} />
    </>
  );
}
