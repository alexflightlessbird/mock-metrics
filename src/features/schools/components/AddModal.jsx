// Dependency imports
import { Modal, Select } from "@mantine/core";

// Component imports
import IconButton from "../../../common/components/IconButton";

export default function AddModal({ opened, onClose, title, form, onSubmit, fields }) {
    function renderField (field) {
        switch (field.type) {
            case "select":
                if (!field.name || !field.options || field.options.length < 1) return console.error("Error with field - type select");
                return (
                    <Select
                        key={field.name}
                        withAsterisk={field.required ?? false}
                        label={field.label || ""}
                        allowDeselect={field.allowDeselect ?? false}
                        data={field.options}
                        {...form.getInputProps(field.name)}
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