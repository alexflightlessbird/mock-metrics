import { Stack } from "@mantine/core";
import SegmentedFilterControl from "./SegmentedFilterControl";

export default function StudentFilters({
    statusValue,
    onStatusChange,
    statusOptions,
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
        </Stack>
    )
}