// Dependency imports
import { Modal } from "@mantine/core";

// Component imports
import BaseForm from "./BaseForm";

export default function FormModal({ opened, onClose, title, form, onSubmit, fields }) {
    return (
        <Modal opened={opened} onClose={onClose} title={title} centered>
            <BaseForm
                fields={fields}
                form={form}
                onSubmit={onSubmit}
            />
        </Modal>
    )
}