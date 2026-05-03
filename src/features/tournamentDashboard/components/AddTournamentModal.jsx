import { useSessionStorage } from "@mantine/hooks";
import { useAddTournament } from "../hooks/useAddTournament";
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
import {
  ModalDateInput,
  ModalSelect,
} from "../../../common/components/modals-new/ModalDropdownComponents";
import Loader from "../../../common/components/loader/GavelLoader";
import RadioCardGroup from "../../../common/components/RadioCards";

const typeOptions = [
  { label: "Pre-Stack", value: "pre-stack" },
  { label: "Post-Stack", value: "post-stack" },
];
const areaOptions = [
  { label: "Invitational", value: "invitational" },
  { label: "Regionals", value: "regionals" },
  { label: "ORCS", value: "orcs" },
  { label: "Nationals", value: "nationals" },
  { label: "Rookie Rumble", value: "rookie rumble" },
  { label: "OLT", value: "olt" },
  { label: "Other", value: "other" },
];

/**
 * @typedef {Object} AddTournamentModalProps
 * @property {Function} [onClose] - Callback when modal closes
 * @property {React.ReactNode} [trigger] - Trigger element
 * @property {string} schoolId - ID of the school to which the tournament belongs
 */

/**
 * @param {AddTournamentModalProps} props
 */

export default function AddTournamentModal({ onClose, trigger, schoolId }) {
  const [formData, setFormData] = useSessionStorage({
    key: "add-tournament-form",
    defaultValue: {
      name: "",
      year: new Date().getFullYear(),
      type: null,
      date: new Date(),
      area: null,
      caseId: null,
    },
  });
  const { mutate: addTournament } = useAddTournament();
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
    [cases],
  );

  const validateForm = () => {
    return (
      formData.name.trim() !== "" &&
      formData.year !== null &&
      formData.type !== null &&
      formData.area !== null &&
      formData.caseId !== null &&
      formData.date !== null &&
      new Date(formData.date).getFullYear() == formData.year
    );
  };

  const handleReset = () => {
    setFormData({
      name: "",
      year: new Date().getFullYear(),
      type: null,
      date: new Date(),
      area: null,
      caseId: null,
    });
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      showError({
        title: "Validation Error",
        message: "Please complete all required fields",
      });
      return;
    }

    addTournament(
      {
        name: formData.name,
        year: parseInt(formData.year),
        type: formData.type,
        area: formData.area,
        caseId: formData.caseId,
        date: formData.date,
        schoolId,
      },
      {
        onSuccess: () => {
          if (onClose) onClose();
          closeModal("add-tournament-form");
          setFormData({
            name: "",
            year: new Date().getFullYear(),
            type: null,
            area: null,
            caseId: null,
            date: new Date(),
          });
          localStorage.removeItem("add-tournament-form");
        },
      },
    );
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (date) => {
    handleInputChange("date", date);
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    handleInputChange("year", year);
  };

  const pages = [
    // Page 0: Tournament Details
    <Stack key={0}>
      <Text size="sm" c="dimmed">
        Enter the tournament details
      </Text>
      <TextInput
        ref={firstInputRef}
        value={formData.name}
        onChange={(e) => handleInputChange("name", e.target.value)}
        label="Tournament Name"
        required
      />

      <ModalDateInput
        value={formData.date}
        onChange={(date) => handleDateChange(date)}
        label="Tournament Start Date"
        required
        maxDate={new Date(new Date().getFullYear() + 1, 11, 31)} // last day of the next year
        minDate={new Date(1980, 0, 1)} // first day of 1980
        highlightToday
        firstDayOfWeek={1}
      />

      <RadioCardGroup
        name="tournamentType"
        label="Tournament Type"
        value={formData.type}
        options={typeOptions}
        onChange={(_, value) => handleInputChange("type", value)}
        required={true}
      />
      <RadioCardGroup
        name="tournamentArea"
        label="Tournament Area"
        value={formData.area}
        options={areaOptions}
        onChange={(_, value) => handleInputChange("area", value)}
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
      modalId="add-tournament-form"
      initialFocusRef={firstInputRef}
      trigger={trigger}
      title={casesLoading ? "Loading..." : "Add Tournament"}
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
