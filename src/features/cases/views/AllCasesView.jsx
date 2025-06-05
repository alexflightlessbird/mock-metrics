// Dependency imports
import { Link, useSearchParams } from "react-router-dom";
import { Text, SegmentedControl } from "@mantine/core";

// Component imports
import CaseList from "../components/lists/CaseList";

// Hooks imports
import { useCaseFilters } from "../hooks/useCaseFilters";

export default function AllCasesView({ allCases }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeCases, inactiveCases] = useCaseFilters(allCases);

    const filter = searchParams.get("filter") || "active";

    const amtaItem = <Link to="https://www.collegemocktrial.org/resources/case-materials" target="_blank">AMTA Case Materials</Link>;

    const handleFilterChange = (newFilter) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('filter', newFilter);
        setSearchParams(newSearchParams);
    };

    const getFilteredCases = () => {
        switch (filter) {
            case "active": return activeCases;
            case "inactive": return inactiveCases;
            case "all": return [...activeCases, ...inactiveCases];
            default: return activeCases;
        }
    }

    const filterOptions = [
        { label: "All", value: "all" },
        ...(activeCases.length > 0 ? [{ label: "Active", value: "active" }]  : [{ label: "Active", value: "active", disabled: true }]),
        ...(inactiveCases.length > 0 ? [{ label: "Inactive", value: "inactive" }] : [{ label: "Inactive", value: "inactive", disabled: true }])
    ];

    const currentFilter = (filter === "inactive" && inactiveCases.length === 0) || (filter === "active" && activeCases.length === 0) ? "all" : filter;

    return (
        <>
            <h1>Cases</h1>
            <Text>Per AMTA rules and copyright guidelines, MockMetrics does not provide any content nor access to material. For case materials or questions, please visit the {amtaItem} website, or contact AMTA directly. MockMetrics is not affiliated with, nor endorsed by, AMTA.</Text>
            <br />
            <h2>All Cases</h2>
            <SegmentedControl
                value={currentFilter}
                onChange={handleFilterChange}
                data={filterOptions}
                mb="md"
                disabled={allCases.length > 0 ? false : true}
            />
            <CaseList cases={getFilteredCases()} />
        </>
    )
}