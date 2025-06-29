import { SegmentedControl, Select, Group, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export default function BaseFilterControl({
    value,
    onChange,
    options,
    disabled = false,
    label,
    size = "sm",
    responsive = false
}) {
    const isMobile = useMediaQuery("(max-width: 768px)");

    if (responsive && isMobile) {
        return (
            <Group>
                {label && <Text>{label}: </Text>}
                <Select
                    value={value}
                    onChange={onChange}
                    data={options}
                    disabled={disabled}
                    allowDeselect={false}
                    size={size}
                />
            </Group>
        )
    }

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