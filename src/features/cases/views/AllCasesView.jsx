// Dependency imports
import { Link, useSearchParams } from "react-router-dom";
import { Text, SegmentedControl, Stack } from "@mantine/core";

// Component imports
import CaseList from "../components/lists/CaseList";
import List from "../../../common/components/List";

// Hooks imports
import { useCaseFilters } from "../hooks/useCaseFilters";

export default function AllCasesView({ allCases }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeCases, inactiveCases] = useCaseFilters(allCases);

    const statusFilter = searchParams.get("status") || "active";
    const typeFilter = searchParams.get("type") || "all";

    const amtaItem = <Link to="https://www.collegemocktrial.org/resources/case-materials" target="_blank">AMTA Case Materials</Link>;

    const handleStatusFilterChange = (newFilter) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("status", newFilter);
        setSearchParams(newSearchParams);
    };

    const handleTypeFilterChange = (newFilter) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("type", newFilter);
        setSearchParams(newSearchParams);
    }

    const getFilteredCases = () => {
        let filtered = [];
        switch (statusFilter) {
            case "active": filtered = activeCases; break;
            case "inactive": filtered = inactiveCases; break;
            case "all": filtered = [...activeCases, ...inactiveCases]; break;
            default: filtered = activeCases; break;
        }

        if (typeFilter !== "all") {
            filtered = filtered.filter(c => c.type.toLowerCase() === typeFilter);
        }

        return filtered;
    }

    const statusFilterOptions = [
        { label: "All", value: "all" },
        ...(activeCases.length > 0 ? [{ label: "Active", value: "active" }]  : [{ label: "Active", value: "active", disabled: true }]),
        ...(inactiveCases.length > 0 ? [{ label: "Inactive", value: "inactive" }] : [{ label: "Inactive", value: "inactive", disabled: true }])
    ];

    const typeFilterOptions = [
        { label: "All", value: "all" },
        { label: "Civil", value: "civil" },
        { label: "Criminal", value: "criminal" }
    ];

    const currentStatusFilter = (statusFilter === "inactive" && inactiveCases.length === 0) || (statusFilter === "active" && activeCases.length === 0) ? "all" : statusFilter;
    const currentTypeFilter = typeFilter;

    return (
        <>
            <h1>Cases</h1>
            <Text>Per AMTA rules and copyright guidelines, MockMetrics does not provide any content nor access to material. For case materials or questions, please visit the {amtaItem} website, or contact AMTA directly. MockMetrics is not affiliated with, nor endorsed by, AMTA.</Text>
            <br />
            <h2>All Cases</h2>
            <Stack gap="xs" mb="md" maw="700px">
                <SegmentedControl
                    value={currentStatusFilter}
                    onChange={handleStatusFilterChange}
                    data={statusFilterOptions}
                    disabled={allCases.length > 0 ? false : true}
                />
                <SegmentedControl
                    value={currentTypeFilter}
                    onChange={handleTypeFilterChange}
                    data={typeFilterOptions}
                    disabled={allCases.length > 0 ? false : true}
                    size="xs"
                />
            </Stack>
            <CaseList cases={getFilteredCases()} />
        </>
    )
}