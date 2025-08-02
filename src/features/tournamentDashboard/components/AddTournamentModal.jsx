import {
  Modal,
  Radio,
  Button,
  Group,
  Stack,
  Text,
  Box,
  Select,
  MultiSelect,
  Table,
  TextInput,
  NumberInput,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useAddTournament } from "../hooks/useAddTournament";
import useNotifications from "../../../common/hooks/useNotifications";
import { useCasesData } from "../../../common/hooks/useCasesData";
import Loader from "../../../common/components/loader/GavelLoader";

export default function AddTournamentModal({ opened, onClose, schoolId }) {
  const [activePage, setActivePage] = useState(0);
  const [formData, setFormData] = useLocalStorage({
    key: "add-tournament-form",
    defaultValue: {
      name: "",
      year: new Date().getFullYear(),
      type: null,
      area: null,
      caseId: null,
    },
  });
  const { mutate: addTournament } = useAddTournament();
  const { showError } = useNotifications();

  const { data: cases, isLoading: casesLoading } = useCasesData();

  useEffect(() => {
    if (opened) {
      setActivePage(0);
    }
  }, [opened]);

  if (casesLoading)
    return (
      <Modal
        opened={opened}
        onClose={onClose}
        title="Loading..."
        size="md"
        centered
      >
        <Box py="xl">
          <Loader />
        </Box>
      </Modal>
    );

  const validateCurrentPage = () => {
    switch (activePage) {
      case 0:
        return (
          formData.name.trim() !== "" &&
          formData.year !== null &&
          formData.type !== null &&
          formData.area !== null &&
          formData.caseId !== null
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateCurrentPage()) {
      setActivePage(activePage + 1);
    }
  };

  const handleBack = () => {
    setActivePage(activePage - 1);
  };

  const handleReset = () => {
    setActivePage(0);
    setFormData({
      name: "",
      year: new Date().getFullYear(),
      type: null,
      area: null,
      caseId: null,
    });
  };

  const handleSubmit = () => {
    if (!validateCurrentPage()) {
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
        schoolId,
      },
      {
        onSuccess: () => {
          onClose();
          localStorage.removeItem("add-tournament-form");
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

  const caseOptions = cases.map((c) => {
    return {
      label: c.name,
      value: c.id,
    };
  });
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

  const pages = [
    // Page 0: Tournament Details
    <Stack key={0}>
      <Text size="sm" c="dimmed">
        Enter the tournament details
      </Text>
      <TextInput
        value={formData.name}
        onChange={(e) => handleInputChange("name", e.target.value)}
        label="Tournament Name"
      />

      <NumberInput
        value={formData.year}
        onChange={(value) => handleInputChange("year", value)}
        label="Year"
        min={1980}
        max={new Date().getFullYear() + 1}
      />

      <Select
        data={typeOptions}
        value={formData.type}
        onChange={(value) => handleInputChange("type", value)}
        clearable
        label="Tournament Type"
      />

      <Select
        data={areaOptions}
        value={formData.area}
        onChange={(value) => handleInputChange("area", value)}
        clearable
        label="Tournament Area"
      />

      <Select
        data={caseOptions}
        value={formData.caseId}
        onChange={(value) => handleInputChange("caseId", value)}
        clearable
        label="Associated Case"
      />
    </Stack>,
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Add Tournament"
      size="xl"
      centered
      styles={{
        content: { maxHeight: "80%", overflowY: "auto" },
        body: { overflowY: "auto" },
      }}
    >
      {pages[activePage]}

      <Group justify="space-between" mt="xl">
        {activePage !== 0 ? (
          <Button variant="default" onClick={handleBack}>
            Back
          </Button>
        ) : (
          <Button variant="default" onClick={handleReset}>
            Reset
          </Button>
        )}

        {activePage < pages.length - 1 ? (
          <Button onClick={handleNext} disabled={!validateCurrentPage()}>
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!validateCurrentPage()}>
            Submit
          </Button>
        )}
      </Group>
    </Modal>
  );
}
