import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SingleCaseView from "../views/SingleCaseView";
import AllCasesView from "../views/AllCasesView";
import SingleCaseRouter from "./SingleCaseRouter";

export default function CasesRouter({ allCases }) {
    const [searchParams] = useSearchParams();
    const caseId = searchParams.get("caseId");

    const selectedCase = useMemo(() => {
        if (!caseId) return null;
        return allCases.find((c) => c.id === parseInt(caseId)) || null;
    }, [caseId, allCases]);

    const [currentAllCaseTab, setCurrentAllCaseTab] = useState("active");

    if (!caseId) return <AllCasesView allCases={allCases} currentAllCaseTab={currentAllCaseTab} setCurrentAllCaseTab={setCurrentAllCaseTab} />;
    if (caseId && !selectedCase) return <SingleCaseView selectedCase="Not found" />;
    if (selectedCase) return <SingleCaseRouter selectedCase={selectedCase} />;
}