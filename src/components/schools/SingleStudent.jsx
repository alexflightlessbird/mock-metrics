import React from "react";
import List from "../common/List";
import { Link } from "react-router-dom";
import { Checkbox, Flex, Text, TextInput, Modal, Select } from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { ROLES } from "../../utils/constants";
import { EditIcon } from "../common/ActionIcons";
import IconButton from "../common/buttons/NewIconButton";
import { useSchoolDataMutations } from "../../hooks/api/useSchoolData";

export default function SingleStudent({
  selectedSchool,
  selectedStudent = "Not found",
  allTeams = [],
  allStudentTeams = [],
}) {
  const { updateStudent } = useSchoolDataMutations();

  const [opened, { open, close }] = useDisclosure(false, {
    onOpen: () => 
      editStudentForm.setValues({
        name: selectedStudent.name,
        active: selectedStudent.is_active,
        teamId: currentTeam?.team_id?.toString() || "null"
      }),
      onClose: () => editStudentForm.reset(),
    });
    
    const editStudentForm = useForm({
      mode: "uncontrolled",
      validate: {
        name: hasLength(
          { min: 2, max: 40 },
          "Must be 2-40 characters"
        ),
      },
      validateInputOnBlur: true,
      onSubmitPreventDefault: "always"
    });
    
  if (selectedStudent === "Not found" || !selectedStudent) {
    return <Text>Student not found.</Text>
  }

  const handleEditStudentSubmit = async (values) => {
    const { name, active, teamId } = values;
    const originalName = selectedStudent.name;
    const originalActive = selectedStudent.is_active;
    const originalTeam = currentTeam?.team_id;

    const parsedTeamId = teamId === "null" ? null : Number(teamId);
    const originalTeamId = originalTeam ? originalTeam : null;

    const nameChanged = name !== originalName;
    const statusChanged = active !== originalActive;
    const teamChanged = parsedTeamId !== originalTeamId;

    if (!nameChanged && !statusChanged && !teamChanged) {
      close();
      return;
    }

    try {
      await updateStudent({
        studentId: selectedStudent.id,
        name: nameChanged ? name : undefined,
        is_active: statusChanged ? active : undefined,
        newTeamId: teamChanged ? parsedTeamId : undefined,
        originalTeamId: originalTeamId,
        schoolId: selectedSchool.school_id
      });
      close();
    } catch (error) {
      console.error("Student update failed:", error);
    }

  }

  const activeTeams = allTeams.filter((t) => t.is_active);

  const teamOptions = [
    { value: "null", label: "None" },
    ...activeTeams.map(team => ({ value: team.id.toString(), label: team.name }))
  ];

  const currentTeam = allStudentTeams.find((t) => t.student_id === selectedStudent.id && t.is_active);

  const schoolItem = (
    <Link to={`/schools?schoolId=${selectedSchool.school_id}`}>
      {selectedSchool.schools.name}
    </Link>
  );

  const teamItem = currentTeam 
    ? <Link to={`/schools?schoolId=${selectedSchool.school_id}&teamId=${currentTeam.team_id}`}>{currentTeam.teams.name}</Link>
    : "None";

  const detailItems = [
    `Name: ${selectedStudent.name}`,
    <Text>School: {schoolItem}</Text>,
    <Text>Current Team: {teamItem}</Text>,
    `Status: ${selectedStudent.is_active ? "Active" : "Inactive"}`,
  ];

  return (
    <>
      <h1>{selectedStudent.name}</h1>
      <Flex style={{ alignItems: "center", "gap": "7px" }}>
        <h2>Student Details</h2>
        {(selectedSchool.role === ROLES.PRIMARY || selectedSchool.role === ROLES.ADMIN) && (
          <>
            <EditIcon onClick={open} />
            <Modal opened={opened} onClose={close} title="Edit Student Details" centered={true}>
              <form onSubmit={editStudentForm.onSubmit(handleEditStudentSubmit, (errors) => {
                const firstErrorPath = Object.keys(errors)[0];
                editStudentForm.getInputNode(firstErrorPath)?.focus();
              })}>
                <TextInput
                  data-autofocus
                  placeholder="Enter the student's name"
                  withAsterisk
                  label="Name"
                  {...editStudentForm.getInputProps("name")}
                />
                <br />
                <Select
                  label="Assigned Team"
                  placeholder="Select a team"
                  data={teamOptions}
                  {...editStudentForm.getInputProps("teamId")}
                />
                <br />
                <Checkbox
                  label="Active"
                  style={{ cursor: "pointer" }}
                  {...editStudentForm.getInputProps("active", { type: "checkbox" })}
                />
                <br />
                <IconButton icon="save" type="submit" buttonText="Submit" />
              </form>
            </Modal>
          </>
        )}
      </Flex>
      <List items={detailItems} />
    </>
  )

}