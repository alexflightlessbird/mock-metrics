import List from "../../../common/components/List";
import SingleCaseTabs from "../components/tabs/SingleCaseTabs";
import { useWitnessFilters } from "../hooks/useWitnessFilters";
import NotFound from "../../../common/components/NotFound";

export default function SingleCaseView({
  selectedCase,
  allCaseWitnesses,
  currentTab,
  setCurrentTab,
}) {
  const pSide = selectedCase.type === "Civil" ? "Plaintiff" : "Prosecution";

  const [pWitnesses, dWitnesses, sWitnesses] = useWitnessFilters(
    allCaseWitnesses,
    pSide
  );

  const detailItems = [
    `Year: ${selectedCase.year}`,
    `Status: ${selectedCase.is_active ? "Active" : "Inactive"}`,
    `Type: ${selectedCase.type}`,
    `Area: ${selectedCase.area}`,
  ];

  return (
    <>
      <h1>{selectedCase.name}</h1>
      <List items={detailItems} />
      <br />
      <h2>All Witnesses</h2>
      <SingleCaseTabs
        pWitnesses={pWitnesses}
        dWitnesses={dWitnesses}
        sWitnesses={sWitnesses}
        pSide={pSide}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
    </>
  );
}
