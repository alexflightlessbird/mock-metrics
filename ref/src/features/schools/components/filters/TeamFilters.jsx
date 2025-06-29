import FilterContainer from "./FilterContainer";
import StatusFilter from "./StatusFilter";
import TypeFilter from "./TypeFilter";

export default function TeamFilters({
    statusValue,
    onStatusChange,
    activeTeams = [],
    inactiveTeams = [],
    typeValue,
    onTypeChange,
    disabled = false
}) {
    return (
        <FilterContainer>
            <StatusFilter
                value={statusValue}
                onChange={onStatusChange}
                activeItems={activeTeams}
                inactiveItems={inactiveTeams}
                disabled={disabled}
            />
            <TypeFilter
                value={typeValue}
                onChange={onTypeChange}
                disabled={disabled}
                size="xs"
            />
        </FilterContainer>
    )
}