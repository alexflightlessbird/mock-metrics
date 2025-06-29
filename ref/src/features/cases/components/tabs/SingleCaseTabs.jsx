// Component imports
import WitnessList from "../lists/WitnessList";
import TabbedView from "../../../../common/components/TabbedView";

export default function SingleCaseTabs({
  pWitnesses,
  dWitnesses,
  sWitnesses,
  pSide,
  currentTab,
  setCurrentTab,
}) {
  const tabs = [
    {
      label: pSide,
      value: pSide,
      content: (
        <>
          <h3>{pSide} Witnesses</h3>
          <WitnessList witnesses={pWitnesses} />
        </>
      ),
    },
    {
      label: "Defense",
      value: "defense",
      content: (
        <>
          <h3>Defense Witnesses</h3>
          <WitnessList witnesses={dWitnesses} />
        </>
      ),
    },
    {
      label: "Swing",
      value: "swing",
      content: (
        <>
          <h3>Swing Witnesses</h3>
          <WitnessList witnesses={sWitnesses} />
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
