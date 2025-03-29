import { useSearchParams } from "react-router-dom";
import { useCaseWitnesses } from "../../../hooks/api/useCases";
import { useState } from "react";
import { useSelectedItem } from "../../../common/hooks/useSelectedItem";
import SingleCaseView from "../views/SingleCaseView";
import SingleWitnessView from "../views/SingleWitnessView";
import NotFound from "../../../common/components/NotFound";
import Loading from "../../../common/components/Loading";

export default function SingleCaseRouter({ selectedCase }) {
  const [searchParams] = useSearchParams();
  const witnessId = searchParams.get("witnessId");

  const { data: allCaseWitnesses = [], isPending } = useCaseWitnesses(
    selectedCase.id
  );

  const selectedWitness = useSelectedItem({
    items: allCaseWitnesses,
    id: witnessId,
  });

  const [currentCaseTab, setCurrentCaseTab] = useState(
    selectedCase.type === "Civil" ? "Plaintiff" : "Prosecution"
  );

  if (isPending) return <Loading />;

  if (!witnessId)
    return (
      <SingleCaseView
        selectedCase={selectedCase}
        allCaseWitnesses={allCaseWitnesses}
        currentTab={currentCaseTab}
        setCurrentTab={setCurrentCaseTab}
      />
    );
  if (witnessId && !selectedWitness) return <NotFound type="witness" />;
  if (selectedWitness)
    return <SingleWitnessView selectedWitness={selectedWitness} />;
}
