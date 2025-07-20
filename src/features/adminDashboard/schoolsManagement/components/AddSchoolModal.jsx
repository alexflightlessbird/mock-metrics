import { Button } from "@mantine/core";
import { useState } from "react";
import BaseModal from "../../../../common/components/modals/BaseModal";
import { NameField, StatusField } from "../../common/FormFields";

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
    <BaseModal opened={opened} onClose={onClose} title="Add School">
      <form onSubmit={handleSubmit}>
        <NameField
          value={formValues.name}
          onChange={(e) =>
            setFormValues((v) => ({ ...v, name: e.target.value }))
          }
          autofocus={true}
        />
        <NameField
          value={formValues.short_name}
          onChange={(e) =>
            setFormValues((v) => ({ ...v, short_name: e.target.value }))
          }
          label="Short Name"
        />
        <StatusField
          value={formValues.is_premium}
          onChange={(e) =>
            setFormValues((v) => ({ ...v, is_premium: e.target.checked }))
          }
          questionLabel="Premium Status"
        />
        <Button type="submit" loading={isLoading}>
          Submit
        </Button>
      </form>
    </BaseModal>
  );
}
