import { TextInput, Select, NumberInput, Checkbox } from "@mantine/core";
import IconButton from "./IconButton";

export default function BaseForm({ fields, form, onSubmit }) {
    function renderField (field) {
        switch (field.type) {
            case "text":
                if (!field.name) return console.error("Error with field - type text");
                return (
                    <TextInput
                        key={field.name}
                        data-autofocus={field.autofocus ?? false}
                        placeholder={field.placeholder || ""}
                        withAsterisk={field.required ?? false}
                        label={field.label || ""}
                        disabled={field.disabled ?? false}
                        {...form.getInputProps(field.name)}
                    />
                )
            case "select":
                if (!field.name || !field.options || field.options.length < 1) return console.error("Error with field - type select");
                return (
                    <Select
                        key={field.name}
                        withAsterisk={field.required ?? false}
                        label={field.label || ""}
                        allowDeselect={field.allowDeselect ?? false}
                        searchable={field.searchable ?? true}
                        nothingFoundMessage="Nothing found..."
                        data={field.options}
                        disabled={field.disabled ?? false}
                        {...form.getInputProps(field.name)}
                    />
                )
            case "number":
                if (!field.name) return console.error("Error with field - type number");
                return (
                    <NumberInput
                        key={field.name}
                        placeholder={field.placeholder || ""}
                        withAsterisk={field.required ?? false}
                        label={field.label || ""}
                        allowNegative={field.allowNegative ?? false}
                        allowDecimal={field.allowDecimal ?? false}
                        min={field.min}
                        max={field.max}
                        disabled={field.disabled ?? false}
                        {...form.getInputProps(field.name)}
                    />
                )
            case "checkbox":
                if (!field.name) return console.error("Error with field - type checkbox");
                return (
                    <Checkbox
                        key={field.name}
                        label={field.label || ""}
                        style={{ cursor: "pointer" }}
                        disabled={field.disabled ?? false}
                        {...form.getInputProps(field.name, { type: "checkbox" })}
                    />
                )
            default:
                return null;
        }
    }

    return (
        <form onSubmit={form.onSubmit(onSubmit, (errors) => {
            const firstErrorPath = Object.keys(errors)[0];
            form.getInputNode(firstErrorPath)?.focus();
        })}>
            {fields.map((field) => (
                <div key={field.name}>
                    {renderField(field)}
                    <br />
                </div>
            ))}
            <IconButton icon="save" type="submit" buttonText="Submit" />
        </form>
    )
}
