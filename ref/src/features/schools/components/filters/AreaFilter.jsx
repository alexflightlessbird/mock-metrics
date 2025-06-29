import BaseFilterControl from "./BaseFilterControl";

export default function AreaFilter({
    value,
    onChange,
    disabled = false,
    size = "sm",
    label = "Area",
    responsive = true
}) {
    const options = [
        { label: "All", value: "all" },
        { label: "Invitational", value: "invitational" },
        { label: "Regionals", value: "regionals" },
        { label: "ORCS", value: "orcs" },
        { label: "Nationals", value: "nationals" },
        { label: "Rookie Rumble", value: "rookie rumble" },
        { label: "OLT", value: "olt" },
        { label: "Other", value: "other" }
    ];

    return (
        <BaseFilterControl
            value={value}
            onChange={onChange}
            options={options}
            disabled={disabled}
            size={size}
            label={label}
            responsive={responsive}
        />
    )
}