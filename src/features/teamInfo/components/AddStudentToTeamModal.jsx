import { useTeamStudents } from "../../../common/hooks/useTeamDetails";
import useNotifications from "../../../common/hooks/useNotifications";
import { useRef, useMemo, useState } from "react";
import BaseModal from "../../../common/components/modals-new/BaseModal";
import { Group, Stack, Button, Text } from "@mantine/core";
import { useModal } from "../../../context/ModalContext";
import { ModalSelect } from "../../../common/components/modals-new/ModalDropdownComponents";

export default function AddStudentToTeamModal({
  onClose,
  trigger,
  teamId,
  teamName,
  existingStudentIds = [],
  allStudents = [],
}) {
  const [formData, setFormData] = useState({
    studentId: null,
  });
  const { addStudentToTeam } = useTeamStudents(teamId);
  const { showError } = useNotifications();
  const firstInputRef = useRef(null);
  const { closeModal } = useModal();

  const currentTeamOfStudent = (studentId) => {
    const student = allStudents.find((s) => s.id === studentId);
    const studentTeam = student?.students_teams?.find((st) => st.is_active);
    return studentTeam ? studentTeam.teams.name : null;
  };

  const availableStudents = useMemo(() => {
    return allStudents
      .filter((student) => !existingStudentIds.includes(student.id))
      .filter((student) => student.is_active)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allStudents, existingStudentIds]);

  const availableStudentsOptions = useMemo(() => {
    return availableStudents.map((student) => ({
      value: student.id,
      label: `${student.name}${
        currentTeamOfStudent(student.id)
          ? ` (${currentTeamOfStudent(student.id)})`
          : ""
      }`,
    }));
  }, [availableStudents]);

  const validateForm = () => {
    return formData.studentId !== null;
  };

  const handleReset = () => {
    setFormData({
      studentId: null,
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

    addStudentToTeam(
      { studentId: formData.studentId, teamId },
      {
        onSuccess: () => {
          if (onClose) onClose();
          closeModal("add-student-to-team-modal-" + teamId);
          handleReset();
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
    // Page 0: Select Student
    <Stack key={0}>
      <Text size="sm" c="dimmed">
        This will remove the selected student from their current team if they
        are already assigned to one. Ballots and ballot analysis will remain intact from any previous teams.
      </Text>

      <ModalSelect
        ref={firstInputRef}
        label="Student"
        placeholder="Select a student"
        data={availableStudentsOptions}
        value={formData.studentId}
        onChange={(e) => handleInputChange("studentId", e)}
        searchable
        required
      />
    </Stack>,
  ];

  return (
    <BaseModal
      modalId={`add-student-to-team-modal-${teamId}`}
      title={`Add Student to ${teamName}`}
      initialFocusRef={firstInputRef}
      trigger={trigger}
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
