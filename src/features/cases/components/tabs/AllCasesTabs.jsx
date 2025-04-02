// Component imports
import CaseList from "../lists/CaseList";
import TabbedView from "../../../../common/components/TabbedView";

export default function AllCasesTabs({
  activeCases,
  inactiveCases,
  currentTab,
  setCurrentTab,
}) {
  const tabs = [
    {
      value: "active",
      label: "Active",
      content: (
        <>
          <h3>Active Cases</h3>
          <CaseList cases={activeCases} />
        </>
      ),
    },
    {
      value: "inactive",
      label: "Inactive",
      content: (
        <>
          <h3>Inactive Cases</h3>
          <CaseList cases={inactiveCases} />
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
