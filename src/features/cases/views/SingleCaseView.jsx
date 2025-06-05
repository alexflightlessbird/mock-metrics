// Dependency imports
import { useSearchParams } from "react-router-dom";
import { SegmentedControl, Group } from "@mantine/core";

// Component imports
import WitnessList from "../components/lists/WitnessList";
import List from "../../../common/components/List";

// Hooks imports
import { useWitnessFilters } from "../hooks/useWitnessFilters";

// Utils imports
import { WITNESS_TYPES } from "../../../utils/constants.js";

const witnessTypes = [
  { label: "All", value: "all" },
  { label: WITNESS_TYPES.CHARACTER, value: WITNESS_TYPES.CHARACTER.toLowerCase() },
  { label: WITNESS_TYPES.EXPERT, value: WITNESS_TYPES.EXPERT.toLowerCase() },
  { label: WITNESS_TYPES.PARTY_REP, value: WITNESS_TYPES.PARTY_REP.toLowerCase() },
  { label: WITNESS_TYPES.POLICE_INVESTIGATOR, value: WITNESS_TYPES.POLICE_INVESTIGATOR.toLowerCase() },
  { label: WITNESS_TYPES.OTHER, value: WITNESS_TYPES.OTHER.toLowerCase() }
];

export default function SingleCaseView({
  selectedCase,
  allCaseWitnesses
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const pSide = selectedCase.type === "Civil" ? "Plaintiff" : "Prosecution";
  const [pWitnesses, dWitnesses, sWitnesses] = useWitnessFilters(
    allCaseWitnesses,
    pSide
  );

  const sideFilter = searchParams.get("side") || "all";
  const typeFilter = searchParams.get("type") || "all";

  const handleSideFilterChange = (newFilter) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("side", newFilter);
    setSearchParams(newSearchParams);
  };

  const handleTypeFilterChange = (newFilter) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("type", newFilter);
    setSearchParams(newSearchParams);
  }

  const getFilteredWitnesses = () => {
    let filtered = [];
    switch (sideFilter) {
      case pSide.toLowerCase(): filtered = pWitnesses; break;
      case "defense": filtered = dWitnesses; break;
      case "swing": filtered = sWitnesses; break;
      case "all":
      default:
        filtered = [...pWitnesses, ...dWitnesses, ...sWitnesses];
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(witness => witness.type.toLowerCase() === typeFilter);
    }
    
    return filtered;
  }

  const sideFilterOptions = [
    { label: "All", value: "all" },
    ...(pWitnesses.length > 0 ?
      [{ label: pSide, value: pSide.toLowerCase() }] :
      [{ label: pSide, value: pSide.toLowerCase(), disabled: true }]
    ),
    ...(dWitnesses.length > 0 ?
      [{ label: "Defense", value: "defense" }] :
      [{ label: "Defense", value: "defense", disabled: true }]
    ),
    ...(sWitnesses.length > 0 ?
      [{ label: "Swing", value: "swing" }] :
      [{ label: "Swing", value: "swing", disabled: true }]
    )
  ]

  const currentSideFilter = 
    (sideFilter === pSide.toLowerCase() && pWitnesses.length === 0) ||
    (sideFilter === "defense" && dWitnesses.length === 0) ||
    (sideFilter === "swing" && sWitnesses.length === 0) ?
    "all" : sideFilter;

  const currentTypeFilter = typeFilter;

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
      <Group gap="xs" mb="md">
        <SegmentedControl
          value={currentSideFilter}
          onChange={handleSideFilterChange}
          data={sideFilterOptions}
          disabled={allCaseWitnesses.length > 0 ? false : true}
        />
        <SegmentedControl
          value={currentTypeFilter}
          onChange={handleTypeFilterChange}
          data={witnessTypes}
          disabled={allCaseWitnesses.length > 0 ? false : true}
        />
      </Group>
      <WitnessList witnesses={getFilteredWitnesses()} />
    </>
  )
}