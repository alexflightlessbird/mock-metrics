import { useSessionStorage } from "@mantine/hooks";
import { useAddStudent } from "../hooks/useAddStudent";
import useNotifications from "../../../common/hooks/useNotifications";
import { useRef, useMemo } from "react";
import BaseModal from "../../../common/components/modals-new/BaseModal";
import { Group, TextInput, Stack, Button, Text } from "@mantine/core";
import { useModal } from "../../../context/ModalContext";
import Loader from "../../../common/components/loader/GavelLoader";

export default function AddStudentModal({ onClose, trigger, schoolId }) {
  const [formData, setFormData] = useSessionStorage({
    key: "add-student-form",
    defaultValue: {
      name: "",
    },
  });
  const { mutate: addStudent } = useAddStudent();
  const { showError } = useNotifications();
  const firstInputRef = useRef(null);
  const { closeModal } = useModal();

  const validateForm = () => {
    return formData.name.trim() !== "";
  };

  const handleReset = () => {
    setFormData({
      name: "",
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
