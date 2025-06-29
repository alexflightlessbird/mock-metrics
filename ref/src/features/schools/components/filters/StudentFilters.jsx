import FilterContainer from "./FilterContainer";
import StatusFilter from "./StatusFilter";

export default function StudentFilters({
    statusValue,
    onStatusChange,
    activeStudents = [],
    inactiveStudents = [],
    disabled = false
}) {
    return (
        <FilterContainer>
            <StatusFilter
                value={statusValue}
                onChange={onStatusChange}
                activeItems={activeStudents}
                inactiveItems={inactiveStudents}
                disabled={disabled}
            />
        </FilterContainer>
    )
}