import { useMemo } from "react";
import List from "../../../common/components/List";
import SingleCaseTabs from "../components/tabs/SingleCaseTabs";

export default function SingleCaseView({ selectedCase, allCaseWitnesses, currentTab, setCurrentTab }) {
    const pSide = selectedCase.type === "Civil" ? "Plaintiff" : "Prosecution";

    const [pWitnesses, dWitnesses, sWitnesses] = useMemo(() => {
        const p = allCaseWitnesses.filter((w) => w.side === pSide);
        const d = allCaseWitnesses.filter((w) => w.side === "Defense");
        const s = allCaseWitnesses.filter((w) => w.side === "Swing");
        return [p, d, s];
    }, [allCaseWitnesses, pSide]);

    if (!selectedCase || selectedCase === "Not found") {
        return <div>No case found for that ID.</div>
    }

    const detailItems = [
        `Year: ${selectedCase.year}`,
        `Status: ${selectedCase.is_active ? "Active" : "Inactive"}`,
        `Type: ${selectedCase.type}`,
        `Area: ${selectedCase.area}`
    ];

    return (
        <>
            <h1>{selectedCase.name}</h1>
            <List items={detailItems} />
            <br />
            <h2>All Witnesses</h2>
            <SingleCaseTabs pWitnesses={pWitnesses} dWitnesses={dWitnesses} sWitnesses={sWitnesses} pSide={pSide} currentTab={currentTab} setCurrentTab={setCurrentTab} />
        </>
    )
}