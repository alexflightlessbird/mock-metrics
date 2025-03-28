import { useSearchParams } from "react-router-dom";
import { useCaseWitnesses } from "../../../hooks/api/useCases";
import { useMemo, useState } from "react";
import SingleCaseView from "../views/SingleCaseView";
import SingleWitnessView from "../views/SingleWitnessView";
import NotFound from "../../../common/components/NotFound";

export default function SingleCaseRouter({ selectedCase }) {
    const [searchParams] = useSearchParams();
    const witnessId = searchParams.get("witnessId");

    const { data: allCaseWitnesses = [], isPending } = useCaseWitnesses(selectedCase.id);

    const selectedWitness = useMemo(() => {
        if (!witnessId) return null;
        return allCaseWitnesses.find((w) => w.id === parseInt(witnessId)) || null;
    }, [witnessId, allCaseWitnesses]);

    const [currentCaseTab, setCurrentCaseTab] = useState(selectedCase.type === "Civil" ? "Plaintiff" : "Prosecution");

    if (isPending) return <div>Loading case...</div>;

    if (!witnessId) return <SingleCaseView selectedCase={selectedCase} allCaseWitnesses={allCaseWitnesses} currentTab={currentCaseTab} setCurrentTab={setCurrentCaseTab} />;
    if (witnessId && !selectedWitness) return <NotFound type="witness" />;
    if (selectedWitness) return <SingleWitnessView selectedWitness={selectedWitness} />;
}