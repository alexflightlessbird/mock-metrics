import {
  Modal,
  TextInput,
  Checkbox,
  Button,
  Space,
  Input,
} from "@mantine/core";
import { useState } from "react";

export default function AddSchoolModal({ opened, onClose, onSubmit }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    short_name: "",
    is_premium: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formValues.name.trim() || !formValues.short_name.trim()) return;

    setIsLoading(true);

    try {
      await onSubmit(formValues);
      setFormValues({ name: "", short_name: "", is_premium: false });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Add School"
      centered
      withCloseButton
      overlayProps={{ backgroundOpacity: 0.4, blur: 3 }}
      size="100%"
    >
      <form onSubmit={handleSubmit}>
        <TextInput
          value={formValues.name}
          onChange={(e) =>
            setFormValues((v) => ({ ...v, name: e.target.value }))
          }
          label="School Name"
          required
        />
        <Space h="xs" />
        <TextInput
          value={formValues.short_name}
          onChange={(e) =>
            setFormValues((v) => ({ ...v, short_name: e.target.value }))
          }
          label="School Short Name"
          required
        />
        <Space h="xs" />
        <Input.Wrapper label="Premium Status" />
        <Checkbox
          checked={formValues.is_premium}
          onChange={(e) =>
            setFormValues((v) => ({ ...v, is_premium: e.target.checked }))
          }
          label={`${formValues.is_premium ? "Active" : "Inactive"}`}
        />
        <Space h="xs" />
        <Button type="submit" loading={isLoading}>
          Submit
        </Button>
      </form>
    </Modal>
  );
}
