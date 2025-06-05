import { Stack } from "@mantine/core";
import SegmentedFilterControl from "./SegmentedFilterControl";
import ResponsiveFilter from "./ResponsiveFilter";

export default function TournamentFilters({
    statusValue,
    onStatusChange,
    statusOptions,
    typeValue,
    onTypeChange,
    typeOptions,
    areaValue,
    onAreaChange,
    areaOptions,
    disabled = false
}) {
    return (
        <Stack gap="xs" mb="md" maw="700px">
            <SegmentedFilterControl
                value={statusValue}
                onChange={onStatusChange}
                options={statusOptions}
                disabled={disabled}
            />
            <SegmentedFilterControl
                value={typeValue}
                onChange={onTypeChange}
                options={typeOptions}
                disabled={disabled}
                size="xs"
            />
            <ResponsiveFilter
                value={areaValue}
                onChange={onAreaChange}
                options={areaOptions}
                disabled={disabled}
                label="Tournament Area"
                size="xs"
            />
        </Stack>
    )
}