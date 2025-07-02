import { Input, Modal, Radio, Group, Space, Divider, TextInput, Checkbox, Button, Text } from "@mantine/core";
import { useState } from "react";

export default function EditSchoolModal ({ opened, onClose, school, onSubmit }) {
    const [editType, setEditType] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        name: school.name,
        short_name: school.short_name,
        is_premium: school.is_premium
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        
        try {
            await onSubmit({
                id: school.id,
                updates: {
                    ...(formValues.name !== school.name && { name: formValues.name }),
                    ...(formValues.short_name !== school.short_name && { short_name: formValues.short_name }),
                    ...(formValues.is_premium !== school.is_premium && { is_premium: formValues.is_premium })
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
            title={`Edit School (${school?.name})`}
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
                        <Radio value="detail" label="School Details" data-autofocus />
                        <Radio value="assignment" label="School Assignments" />
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
                            label="School Name"
                        />
                        <Space h="xs" />
                        <TextInput
                            value={formValues.short_name}
                            onChange={(e) => setFormValues(v => ({...v, short_name: e.target.value}))}
                            label="School Short Name"
                        />
                        <Space h="xs" />
                        <Input.Wrapper label="Premium Status" />
                        <Checkbox
                            checked={formValues.is_premium}
                            onChange={(e) => setFormValues(v => ({...v, is_premium: e.target.checked}))}
                            label={`${formValues.is_premium ? "Active" : "Inactive"}`}
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

                {editType !== null && (
                  <>
                  </>
                )}
            </form>
        </Modal>
    )
}