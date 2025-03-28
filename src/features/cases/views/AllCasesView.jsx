import { useMemo } from "react";
import { Link } from "react-router-dom";
import AllCasesTabs from "../components/tabs/AllCasesTabs";
import { Text } from "@mantine/core";

export default function AllCasesView({ allCases, currentAllCaseTab, setCurrentAllCaseTab }) {
    const [activeCases, inactiveCases] = useMemo(() => {
        const active = allCases.filter((c) => c.is_active);
        const inactive = allCases.filter((c) => !c.is_active);
        return [active, inactive];
    }, [allCases]);

    const amtaItem = <Link to="https://www.collegemocktrial.org/resources/case-materials/" target="_blank">AMTA Case Materials</Link>

    return (
        <>
            <h1>Cases</h1>
            <Text>Per AMTA rules and copyright guidelines, MockMetrics does not provide any content nor access to material. For case materials or questions, please visit the {amtaItem} website, or contact AMTA directly. MockMetrics is not affiliated with, nor endorsed by, AMTA.</Text>
            <br />
            <h2>All Cases</h2>
            <AllCasesTabs activeCases={activeCases} inactiveCases={inactiveCases} currentTab={currentAllCaseTab} setCurrentTab={setCurrentAllCaseTab} />
        </>
    );
}