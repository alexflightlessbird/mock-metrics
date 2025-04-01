import { Text } from "@mantine/core";
import TabbedView from "../../../../common/components/TabbedView";
import SchoolList from "../lists/SchoolList";

export default function AllSchoolsTabs({
  primarySchools,
  adminSchools,
  viewerSchools,
  currentTab,
  setCurrentTab,
}) {
  const tabs = [];

  if (primarySchools.length > 0) {
    tabs.push({
      value: "primary",
      label: "Primary Admin",
      content: (
        <>
          <h3>Primary Admin Schools</h3>
          <SchoolList schools={primarySchools} />
        </>
      )
    })
  }

  if (adminSchools.length > 0) {
    tabs.push({
      value: "admin",
      label: "Admin",
      content: (
        <>
          <h3>Admin Schools</h3>
          <SchoolList schools={adminSchools} />
        </>
      )
    })
  }

  if (viewerSchools.length > 0) {
    tabs.push({
      value: "viewer",
      label: "Viewer",
      content: (
        <>
          <h3>Viewer Schools</h3>
          <SchoolList schools={viewerSchools} />
        </>
      )
    })
  }

  if (!primarySchools.length > 0 && !adminSchools.length > 0 && !viewerSchools.length > 0) tabs.push({
    value: "none",
    label: "None",
    content: (
      <>
        <h3>No Schools Assigned</h3>
        <Text>You are not currently assigned to any schools.</Text>
      </>
    )
  })

  let defaultTab;

  if (currentTab === "primary") {
    if (primarySchools.length > 0) {
      defaultTab = currentTab;
    } else if (adminSchools.length > 0) {
      defaultTab = "admin";
      setCurrentTab("admin");
    } else if (viewerSchools.length > 0) {
      defaultTab = "viewer";
      setCurrentTab("viewer");
    } else {
      defaultTab = "none";
      setCurrentTab("none");
    }
  } else if (currentTab === "admin") {
    if (adminSchools.length > 0) {
      defaultTab = currentTab;
    } else if (primarySchools.length > 0) {
      defaultTab = "primary";
      setCurrentTab("primary");
    } else if (viewerSchools.length > 0) {
      defaultTab = "viewer";
      setCurrentTab("viewer");
    } else {
      defaultTab = "none";
      setCurrentTab("none");
    }
  } else if (currentTab === "viewer") {
    if (viewerSchools.length > 0) {
      defaultTab = currentTab;
    } else if (primarySchools.length > 0) {
      defaultTab = "primary";
      setCurrentTab("primary");
    } else if (adminSchools.length > 0) {
      defaultTab = "admin";
      setCurrentTab("admin");
    } else {
      defaultTab = "none";
      setCurrentTab("none");
    }
  } else if (currentTab === "none") {
    if (primarySchools.length > 0) {
      defaultTab = "primary";
      setCurrentTab("primary");
    } else if (adminSchools.length > 0) {
      defaultTab = "admin";
      setCurrentTab("admin");
    } else if (viewerSchools.length > 0) {
      defaultTab = "viewer";
      setCurrentTab("viewer");
    } else {
      defaultTab = currentTab;
    }
  }

  return (
    <TabbedView
      tabs={tabs}
      defaultTab={defaultTab}
      onTabChange={setCurrentTab}
    />
  );
}
