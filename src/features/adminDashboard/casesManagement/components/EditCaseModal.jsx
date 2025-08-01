import { Radio, Group, Space, Divider, Button, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import useCaseWitnesses from "../hooks/useCaseWitnesses";
import { ViewWitnesses, AddWitness } from "./WitnessViews";
import BaseModal from "../../../../common/components/modals/BaseModal";
import {
  StatusField,
  CaseAreaField,
  CaseTypeField,
  NameField,
  YearField,
} from "../../common/FormFields";

export default function EditCaseModal({ opened, onClose, selected, onSubmit }) {
  const caseVal = selected;

  const [editType, setEditType] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    name: caseVal?.name,
    year: caseVal?.year,
    type: caseVal?.type,
    area: caseVal?.area,
    is_active: caseVal?.is_active,
  });

  const [witnessView, setWitnessView] = useState("view");
  const [editWitnessId, setEditWitnessId] = useState(null);

  const {
    witnesses,
    isLoading: witnessesLoading,
    addWitness,
    updateWitness,
    deleteWitness,
  } = useCaseWitnesses(caseVal?.id);

  useEffect(() => {
    if (caseVal) {
      setEditType(null);
      setFormValues({
        name: caseVal.name || "",
        year: caseVal.year || new Date().getFullYear(),
        type: caseVal.type || "civil",
        area: caseVal.area || "",
        is_active: caseVal.is_active !== undefined ? caseVal.is_active : false,
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
          ...(formValues.is_active !== caseVal.is_active && {
            is_active: formValues.is_active,
          }),
        },
      });
      onClose();
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <BaseModal
      opened={opened}
      onClose={() => {
        onClose();
        setEditType(null);
        setFormLoading(false);
        setWitnessView("view");
        setEditWitnessId(null);
      }}
      title={`Edit Case (${caseVal?.name})`}
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
            <NameField
              value={formValues.name}
              onChange={(e) =>
                setFormValues((v) => ({ ...v, name: e.target.value }))
              }
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
              onChange={(e) =>
                setFormValues((v) => ({ ...v, is_active: e.target.checked }))
              }
            />
            <Button loading={formLoading} type="submit">
              Submit
            </Button>
          </>
        )}

        {editType === "witness" && (
          <Stack>
            <Radio.Group value={witnessView} onChange={setWitnessView}>
              <Group>
                <Radio value="view" label="View Witnesses" />
                <Radio value="add" label="Add Witness" />
              </Group>
            </Radio.Group>

            {witnessView === "view" && (
              <ViewWitnesses
                witnesses={witnesses}
                onRemove={deleteWitness}
                onUpdate={(data) => updateWitness(data)}
                editWitnessId={editWitnessId}
                setEditWitnessId={setEditWitnessId}
                caseType={caseVal?.type}
              />
            )}

            {witnessView === "add" && (
              <AddWitness
                onSubmit={addWitness}
                isLoading={witnessesLoading}
                caseType={caseVal?.type}
                setType={setWitnessView}
              />
            )}
          </Stack>
        )}
      </form>
    </BaseModal>
  );
}
