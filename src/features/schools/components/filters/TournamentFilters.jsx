import FilterContainer from "./FilterContainer";
import StatusFilter from "./StatusFilter";
import TypeFilter from "./TypeFilter";
import AreaFilter from "./AreaFilter";

export default function TournamentFilters({
    statusValue,
    onStatusChange,
    activeTournaments = [],
    inactiveTournaments = [],
    typeValue,
    onTypeChange,
    areaValue,
    onAreaChange,
    disabled
}) {
    return (
        <FilterContainer>
            <StatusFilter
                value={statusValue}
                onChange={onStatusChange}
                activeItems={activeTournaments}
                inactiveItems={inactiveTournaments}
                disabled={disabled}
            />
            <TypeFilter
                value={typeValue}
                onChange={onTypeChange}
                disabled={disabled}
                size="xs"
            />
            <AreaFilter
                value={areaValue}
                onChange={onAreaChange}
                label="Tournament Area"
                disabled={disabled}
                size="xs"
            />
        </FilterContainer>
    )
}