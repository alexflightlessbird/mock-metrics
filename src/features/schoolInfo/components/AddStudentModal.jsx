import { useSessionStorage } from "@mantine/hooks";
import { useAddStudent } from "../hooks/useAddStudent";
import useNotifications from "../../../common/hooks/useNotifications";
import { useRef } from "react";
import BaseModal from "../../../common/components/modals-new/BaseModal";
import {
  Group,
  TextInput,
  Stack,
  Button,
  Text,
  NumberInput,
} from "@mantine/core";
import { useModal } from "../../../context/ModalContext";

export default function AddStudentModal({ onClose, trigger, schoolId }) {
  const [formData, setFormData] = useSessionStorage({
    key: "add-student-form",
    defaultValue: {
      name: "",
      yearsInMock: 1,
    },
  });
  const { mutate: addStudent } = useAddStudent();
  const { showError } = useNotifications();
  const firstInputRef = useRef(null);
  const { closeModal } = useModal();

  const validateForm = () => {
    return (
      formData.name.trim() !== "" &&
      formData.yearsInMock !== null &&
      formData.yearsInMock > 0
    );
  };

  const handleReset = () => {
    setFormData({
      name: "",
      yearsInMock: 1,
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

    addStudent(
      {
        name: formData.name,
        schoolId,
        yearsInMock: formData.yearsInMock,
      },
      {
        onSuccess: () => {
          if (onClose) onClose();
          closeModal("add-student-form");
          handleReset();
          localStorage.removeItem("add-student-form");
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
    // Page 0: Student Details
    <Stack key={0}>
      <Text size="sm" c="dimmed">
        Enter the student details
      </Text>

      <TextInput
        ref={firstInputRef}
        value={formData.name}
        onChange={(e) => handleInputChange("name", e.target.value)}
        label="Student Name"
        required
      />

      <NumberInput
        value={formData.yearsInMock}
        onChange={(value) => handleInputChange("yearsInMock", value)}
        label="Years in Mock"
        min={1}
        max={5}
        required
        inputMode="numeric"
      />
    </Stack>,
  ];

  return (
    <BaseModal
      modalId="add-student-form"
      initialFocusRef={firstInputRef}
      trigger={trigger}
      title="Add Student"
      onClose={onClose}
      layer={0}
      footer={
        <Group justify="space-between">
          <Button onClick={handleReset}>Reset</Button>
          <Button onClick={handleSubmit} disabled={!validateForm()}>
            Submit
          </Button>
        </Group>
      }
    >
      {pages[0]}
    </BaseModal>
  );
}
