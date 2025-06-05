import { Stack } from "@mantine/core";
import SegmentedFilterControl from "./SegmentedFilterControl";

export default function TeamFilters({
    statusValue,
    onStatusChange,
    statusOptions,
    typeValue,
    onTypeChange,
    typeOptions,
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
        </Stack>
    )
}