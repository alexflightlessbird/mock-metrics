import { Button } from "@mantine/core";
import { useState } from "react";
import BaseModal from "../../../../common/components/modals/BaseModal";
import { StatusField, CaseAreaField, CaseTypeField, NameField, YearField } from "../../common/FormFields";

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
        <NameField 
          value={formValues.name} 
          onChange={(e) => setFormValues((v) => ({ ...v, name: e.target.value }))}
          autofocus={true}
        />
        <YearField 
          value={formValues.year}
          onChange={(e) => setFormValues((v) => ({ ...v, year: e }))}
        />
        <CaseTypeField 
          value={formValues.type}
          onChange={(e) => setFormValues((v) => ({ ...v, type: e }))}
        />
        <CaseAreaField
          value={formValues.area}
          onChange={(e) => setFormValues((v) => ({ ...v, area: e }))}
        />
        <StatusField
          value={formValues.is_active}
          onChange={(e) => setFormValues((v) => ({ ...v, is_active: e.target.checked }))}
        />
        <Button type="submit" loading={isLoading}>
          Submit
        </Button>
      </form>
    </BaseModal>
  );
}
