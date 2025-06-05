import { SegmentedControl } from "@mantine/core";

export default function SegmentedFilterControl({
    value,
    onChange,
    options,
    disabled = false,
    size = "sm"
}) {
    return (
        <SegmentedControl
            value={value}
            onChange={onChange}
            data={options}
            disabled={disabled}
            size={size}
        />
    )
}