import { useMemo } from "react";
import CaseList from "../components/lists/CaseList";

export default function AllCasesView({ allCases }) {
    console.log(allCases);

    const [activeCases, inactiveCases] = useMemo(() => {
        const active = allCases.filter((c) => c.is_active);
        const inactive = allCases.filter((c) => !c.is_active);
        return [active, inactive];
    }, [allCases]);

    return (
        <>
            <h1>Cases</h1>
            <h2>Active Cases</h2>
            <CaseList cases={activeCases} />
            <h2>Inactive Cases</h2>
            <CaseList cases={inactiveCases} />
        </>
    );
}