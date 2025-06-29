import { useMediaQuery } from "@mantine/hooks";

import { Group, Select, Text } from "@mantine/core";
import SegmentedFilterControl from "./SegmentedFilterControl";

export default function ResponsiveFilter({
    value,
    onChange,
    options,
    disabled = false,
    label,
    size = "sm"
}) {
    const isMobile = useMediaQuery('(max-width: 768px)');

    if (isMobile) {
        return (
            <Group>
                {label && <Text>{label}: </Text>}
                <Select
                    value={value}
                    onChange={onChange}
                    data={options}
                    disabled={disabled}
                    allowDeselect={false}
                />
            </Group>
        )
    }

    return (
        <SegmentedFilterControl
            value={value}
            onChange={onChange}
            options={options}
            disabled={disabled}
            size={size}
        />
    )
}