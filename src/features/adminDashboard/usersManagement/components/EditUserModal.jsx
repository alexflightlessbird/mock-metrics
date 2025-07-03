import { Input, Modal, Radio, Group, Space, Divider, TextInput, Checkbox, Button, Text } from "@mantine/core";
import { useEffect, useState } from "react";

export default function EditUserModal ({ opened, onClose, user, onSubmit }) {
    const [editType, setEditType] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        name: user?.name
    });

    useEffect(() => {
        if (user) {
            setFormValues({
                name: user.name || ""
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            await onSubmit({
                id: user.id,
                updates: {
                    ...(formValues.name !== user.name && { name: formValues.name })
                }
            });
            onClose();
        } finally {
            setFormLoading(false);
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={`Edit User (${user?.name})`}
            centered
            withCloseButton
            overlayProps={{ backgroundOpacity: 0.4, blur: 3 }}
        >
            <form onSubmit={handleSubmit}>
                <Radio.Group
                    name="editOption"
                    label="Choose what you want to edit"
                    withAsterisk
                    value={editType}
                    onChange={setEditType}
                >
                    <Group>
                        <Radio value="detail" label="User Details" data-autofocus />
                        <Radio value="assignment" label="User Assignments" />
                    </Group>
                </Radio.Group>

                {editType !== null && (
                    <>
                        <Space h="md" />
                        <Divider />
                        <Space h="sm" />
                    </>
                )}

                {editType === "detail" && (
                    <>
                        <TextInput
                            value={formValues.name}
                            onChange={(e) => setFormValues(v => ({...v, name: e.target.value}))}
                            label="User Name"
                        />
                        <Space h="xs" />
                        <Button loading={formLoading} type="submit">
                            Submit
                        </Button>
                    </>
                )}

                {editType === "assignment" && (
                    <Text>Test = Assignment</Text>
                )}
            </form>
        </Modal>
    )
}