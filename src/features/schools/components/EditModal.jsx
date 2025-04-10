// Dependency imports
import { Select, TextInput, NumberInput, Checkbox, Modal } from "@mantine/core";

// Component imports
import IconButton from "../../../common/components/IconButton";

export default function EditModal ({ opened, onClose, title, form, onSubmit, fields }) {
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
                        {...form.getInputProps(field.name)}
                    />
                );
            case "select":
                if (!field.name || !field.options || field.options.length < 1) return console.error("Error with field - type select"); 
                return (
                    <Select
                        key={field.name}
                        withAsterisk={field.required ?? false}
                        label={field.label || ""}
                        allowDeselect={field.allowDeselect ?? false}
                        searchable={field.searchable ?? true}
                        data={field.options}
                        {...form.getInputProps(field.name)}
                    />
                );
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
                        {...form.getInputProps(field.name, { type: "checkbox" })}
                    />
                )
            default:
                return null;
        }
    }

    return (
        <Modal opened={opened} onClose={onClose} title={title} centered>
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
        </Modal>
    )
}