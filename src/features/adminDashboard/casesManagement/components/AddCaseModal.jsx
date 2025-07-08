import {
  TextInput,
  Select,
  Checkbox,
  Button,
  Space,
  Input,
  NumberInput,
} from "@mantine/core";
import { useState } from "react";
import BaseModal from "../../../../common/components/modals/BaseModal";

export default function AddCaseModal({ opened, onClose, onSubmit }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    year: new Date().getFullYear(),
    type: "civil",
    area: "",
    is_active: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formValues.name.trim()) return;

    setIsLoading(true);

    try {
      await onSubmit(formValues);
      setFormValues({
        name: "",
        year: new Date().getFullYear(),
        type: "civil",
        area: "",
        is_active: true,
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseModal opened={opened} onClose={onClose} title="Add Case">
      <form onSubmit={handleSubmit}>
        <TextInput
          value={formValues.name}
          onChange={(e) =>
            setFormValues((v) => ({ ...v, name: e.target.value }))
          }
          label="Case Name"
          required
        />
        <Space h="xs" />
        <NumberInput
          value={formValues.year}
          onChange={(e) => setFormValues((v) => ({ ...v, year: e }))}
          label="Year"
          required
          min={1980}
          max={new Date().getFullYear()}
        />
        <Space h="xs" />
        <Select
          data={[
            { value: "civil", label: "Civil" },
            { value: "criminal", label: "Criminal" },
          ]}
          allowDeselect={false}
          value={formValues.type}
          onChange={(e) => setFormValues((v) => ({ ...v, type: e }))}
          label="Type"
        />
        <Space h="xs" />
        <Select
          data={[
            { value: "", label: "None" },
            {
              value: "invitationals/regionals/orcs",
              label: "Invitationals/Regionals/ORCS",
            },
            { value: "nationals", label: "Nationals" },
            { value: "rookie rumble", label: "Rookie Rumble" },
            { value: "olt", label: "OLT" },
            { value: "other", label: "Other" },
          ]}
          allowDeselect={false}
          value={formValues.area}
          onChange={(e) => setFormValues((v) => ({ ...v, area: e }))}
          label="Area"
        />
        <Space h="xs" />
        <Input.Wrapper label="Active Status" />
        <Checkbox
          checked={formValues.is_active}
          onChange={(e) =>
            setFormValues((v) => ({ ...v, is_active: e.target.checked }))
          }
          label={`${formValues.is_active ? "Active" : "Inactive"}`}
        />
        <Space h="xs" />
        <Button type="submit" loading={isLoading}>
          Submit
        </Button>
      </form>
    </BaseModal>
  );
}
