import { Input, Modal, Radio, Group, Space, Divider, TextInput, Checkbox, Button, Text, Select, NumberInput, Loader } from "@mantine/core";
import { useEffect, useState } from "react";

export default function EditCaseModal ({ opened, onClose, caseVal, onSubmit }) {
    const [editType, setEditType] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        name: caseVal?.name,
        year: caseVal?.year,
        type: caseVal?.type,
        area: caseVal?.area,
        is_active: caseVal?.is_active
    });

    useEffect(() => {
        if (caseVal) {
            setFormValues({
                name: caseVal.name || "",
                year: caseVal.year || new Date().getFullYear(),
                type: caseVal.type || "civil",
                area: caseVal.area || "",
                is_active: caseVal.is_active !== undefined ? caseVal.is_active : false
            });
        }
    }, [caseVal]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            await onSubmit({
                id: caseVal.id,
                updates: {
                    ...(formValues.name !== caseVal.name && { name: formValues.name }),
                    ...(formValues.year !== caseVal.year && { year: formValues.year }),
                    ...(formValues.type !== caseVal.type && { type: formValues.type }),
                    ...(formValues.area !== caseVal.area && { area: formValues.area }),
                    ...(formValues.is_active !== caseVal.is_active && { is_active: formValues.is_active })
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
            title={`Edit Case (${caseVal?.name})`}
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
                        <Radio value="detail" label="Case Details" data-autofocus />
                        <Radio value="witness" label="Case Witnesses" />
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
                            label="Case Name"
                        />
                        <Space h="xs" />
                        <NumberInput
                            value={formValues.year}
                            onChange={(value) => setFormValues(v => ({...v, year: value}))}
                            label="Year"
                            required
                            min={1980}
                            max={new Date().getFullYear()}
                        />
                        <Space h="xs" />
                        <Select
                            data={[
                                { value: "civil", label: "Civil" },
                                { value: "criminal", label: "Criminal" }
                            ]}
                            allowDeselect={false}
                            value={formValues.type}
                            onChange={(value) => setFormValues(v => ({...v, type: value}))}
                            label="Type"
                        />
                        <Space h="xs" />
                        <Select
                            data={[
                                { value: "", label: "None" },
                                { value: "Invitationals/Regionals/ORCS", label: "Invitationals/Regionals/ORCS" },
                                { value: "Nationals", label: "Nationals" },
                                { value: "Rookie Rumble", label: "Rookie Rumble" },
                                { value: "OLT", label: "OLT" },
                                { value: "Other", label: "Other" }
                            ]}
                            allowDeselect={false}
                            value={formValues.area}
                            onChange={(value) => setFormValues(v => ({...v, area: value}))}
                            label="Area"
                        />
                        <Space h="xs" />
                        <Input.Wrapper label="Active Status" />
                        <Checkbox
                            checked={formValues.is_active}
                            onChange={(e) => setFormValues(v => ({...v, is_active: e.target.checked}))}
                            label={`${formValues.is_active ? "Active" : "Inactive"}`}
                        />
                        <Space h="xs" />
                        <Button loading={formLoading} type="submit">
                            Submit
                        </Button>
                    </>
                )}

                {editType === "witness" && (
                    <Text>Test = Witness</Text>
                )}
            </form>
        </Modal>
    )
}