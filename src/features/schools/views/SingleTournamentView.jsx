import { Link } from "react-router-dom";
import { Text } from "@mantine/core";
import List from "../../../common/components/List";
import { useCases } from "../../../hooks/api/useCases";
import Loading from "../../../common/components/Loading";

export default function SingleTournamentView({ selectedTournament }) {
  const { data: allCases = [], isPending } = useCases();
  
  if (isPending) return <Loading />;

  const linkedCase = allCases.find((c) => c.id === selectedTournament.case_id);
 
  const caseItem = <Link to={`/cases?caseId=${selectedTournament.case_id}`}>{linkedCase.name}</Link>;

  const detailItems = [
    `Year: ${selectedTournament.year}`,
    `Type: ${selectedTournament.type}`,
    `Area: ${selectedTournament.area}`,
    `Status: ${selectedTournament.is_active ? "Active" : "Inactive"}`,
    <Text>Case: {caseItem}</Text>
  ]
  return (
    <>
      <h1>{selectedTournament.name}</h1>
      <List items={detailItems} />
    </>
  );
}
