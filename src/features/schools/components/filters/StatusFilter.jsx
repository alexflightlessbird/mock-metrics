import BaseFilterControl from "./BaseFilterControl";

export default function StatusFilter({
    value,
    onChange,
    activeItems = [],
    inactiveItems = [],
    disabled = false,
    size = "sm",
    responsive = false
}) {
    const options = [
        { label: "All", value: "all" },
        ...(activeItems.length > 0
            ? [{ label: "Active", value: "active" }]
            : [{ label: "Active", value: "active", disabled: true }]
        ),
        ...(inactiveItems.length > 0
            ? [{ label: "Inactive", value: "inactive" }]
            : [{ label: "Inactive", value: "inactive", disabled: true }]
        )
    ];

    return (
        <BaseFilterControl
            value={value}
            onChange={onChange}
            options={options}
            disabled={disabled}
            size={size}
            responsive={responsive}
        />
    )
}