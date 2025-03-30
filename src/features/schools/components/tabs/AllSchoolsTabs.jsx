import TabbedView from "../../../../common/components/TabbedView";
import SchoolList from "../lists/SchoolList";

export default function AllSchoolsTabs({
  primarySchools,
  adminSchools,
  viewerSchools,
  currentTab,
  setCurrentTab,
}) {
  const tabs = [
    {
      value: "primary",
      label: "Primary Admin",
      content: (
        <>
          <h3>Primary Admin Schools</h3>
          <SchoolList schools={primarySchools} />
        </>
      ),
    },
    {
      value: "admin",
      label: "Admin",
      content: (
        <>
          <h3>Admin Schools</h3>
          <SchoolList schools={adminSchools} />
        </>
      ),
    },
    {
      value: "viewer",
      label: "Viewer",
      content: (
        <>
          <h3>Viewer Schools</h3>
          <SchoolList schools={viewerSchools} />
        </>
      ),
    },
  ];

  return (
    <TabbedView
      tabs={tabs}
      defaultTab={currentTab}
      onTabChange={setCurrentTab}
    />
  );
}
