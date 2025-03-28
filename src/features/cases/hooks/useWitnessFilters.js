import { useMemo } from "react";

export function useWitnessFilters(allCaseWitnesses, pSide = "Plaintiff") {
    return useMemo(() => {
        const safeWitnesses = allCaseWitnesses || [];
        const p = safeWitnesses.filter((w) => w.side === pSide);
        const d = safeWitnesses.filter((w) => w.side === "Defense");
        const s = safeWitnesses.filter((w) => w.side === "Swing");
        return [p, d, s];
    }, [allCaseWitnesses, pSide]);
}