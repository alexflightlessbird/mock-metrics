import BaseFilterControl from "./BaseFilterControl";

export default function TypeFilter({
    value,
    onChange,
    disabled = false,
    size = "sm",
    responsive = false
}) {
    const options = [
        { label: "All", value: "all" },
        { label: "Pre-Stack", value: "pre-stack" },
        { label: "Post-Stack", value: "post-stack" }
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