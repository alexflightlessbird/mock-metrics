import { useSessionStorage } from "@mantine/hooks";
import { useAddTeam } from "../hooks/useAddTeam";
import useNotifications from "../../../common/hooks/useNotifications";
import { useCasesData } from "../../../common/hooks/useCasesData";
import { useRef, useMemo } from "react";
import BaseModal from "../../../common/components/modals-new/BaseModal";
import {
  Group,
  NumberInput,
  TextInput,
  Stack,
  Button,
  Text,
} from "@mantine/core";
import { useModal } from "../../../context/ModalContext";
import { ModalSelect } from "../../../common/components/modals-new/ModalDropdownComponents";
import Loader from "../../../common/components/loader/GavelLoader";
import RadioCardGroup from "../../../common/components/RadioCards";

const typeOptions = [
  { label: "Pre-Stack", value: "pre-stack" },
  { label: "Post-Stack", value: "post-stack" },
];

export default function AddTeamModal({ onClose, trigger, schoolId }) {
  const [formData, setFormData] = useSessionStorage({
    key: "add-team-form",
    defaultValue: {
      name: "",
      year: new Date().getFullYear(),
      type: null,
      caseId: null,
    },
  });
  const { mutate: addTeam } = useAddTeam();
  const { showError } = useNotifications();
  const firstInputRef = useRef(null);
  const { closeModal } = useModal();

  const { data: cases, isLoading: casesLoading } = useCasesData();

  const caseOptions = useMemo(
    () =>
      cases
        ?.filter((c) => c.is_active)
        .map((c) => ({
          label: `${c.name} (${c.year})`,
          value: c.id,
        })),
    [cases]
  );

  const validateForm = () => {
    return (
      formData.name.trim() !== "" &&
      formData.year !== null &&
      formData.type !== null &&
      formData.caseId !== null
    );
  };

  const handleReset = () => {
    setFormData({
      name: "",
      year: new Date().getFullYear(),
      type: null,
      caseId: null,
    });
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      showError({
        title: "Validation Error",
        message: "Please fill in all required fields.",
      });
      return;
    }

    addTeam(
      {
        name: formData.name,
        year: parseInt(formData.year),
        type: formData.type,
        caseId: formData.caseId,
        schoolId,
      },
      {
        onSuccess: () => {
          if (onClose) onClose();
          closeModal("add-team-form");
          setFormData({
            name: "",
            year: new Date().getFullYear(),
            type: null,
            caseId: null,
          });
          localStorage.removeItem("add-team-form");
        },
      }
    );
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const pages = [
    // Page 0: Team Details
    <Stack key={0}>
      <Text size="sm" c="dimmed">
        Enter the team details
      </Text>

      <TextInput
        ref={firstInputRef}
        value={formData.name}
        onChange={(e) => handleInputChange("name", e.target.value)}
        label="Team Name"
        required
      />

      <NumberInput
        value={formData.year}
        onChange={(value) => handleInputChange("year", value)}
        label="Team Year"
        min={1980}
        max={new Date().getFullYear() + 1}
        required
        inputMode="numeric"
      />

      <RadioCardGroup
        name="teamType"
        label="Team Type"
        value={formData.type}
        options={typeOptions}
        onChange={(_, value) => handleInputChange("type", value)}
        required={true}
      />

      <ModalSelect
        data={caseOptions}
        value={formData.caseId}
        onChange={(value) => handleInputChange("caseId", value)}
        label="Associated Case"
        required
        searchable
        nothingFoundMessage="No matching cases found"
      />
    </Stack>,
  ];

  return (
    <BaseModal
      modalId="add-team-form"
      initialFocusRef={firstInputRef}
      trigger={trigger}
      title={casesLoading ? "Loading..." : "Add Team"}
      onClose={onClose}
      layer={0}
      footer={
        !casesLoading && (
          <Group justify="space-between">
            <Button onClick={handleReset}>Reset</Button>
            <Button onClick={handleSubmit} disabled={!validateForm()}>
              Submit
            </Button>
          </Group>
        )
      }
    >
      {casesLoading && <Loader />}
      {!casesLoading && pages[0]}
    </BaseModal>
  );
}
