import { useSearchParams } from "react-router-dom";
import { useCaseWitnesses } from "../../../hooks/api/useCases";
import { useMemo } from "react";
import SingleCaseView from "../views/SingleCaseView";
import SingleWitnessView from "../views/SingleWitnessView";

export default function SingleCaseRouter({ selectedCase }) {
    const [searchParams] = useSearchParams();
    const witnessId = searchParams.get("witnessId");

    const { data: allCaseWitnesses = [], isPending } = useCaseWitnesses(selectedCase.id);

    const selectedWitness = useMemo(() => {
        if (!witnessId) return null;
        return allCaseWitnesses.find((w) => w.id === parseInt(witnessId)) || null;
    }, [witnessId, allCaseWitnesses]);

    if (isPending) return <div>Loading case...</div>;

    if (!witnessId) return <SingleCaseView selectedCase={selectedCase} allCaseWitnesses={allCaseWitnesses} />;
    if (witnessId && !selectedWitness) return <SingleWitnessView selectedWitness="Not found" />;
    if (selectedWitness) return <SingleWitnessView selectedWitness={selectedWitness} />;
}