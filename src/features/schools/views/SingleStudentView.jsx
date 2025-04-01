import List from "../../../common/components/List";
import { Link } from "react-router-dom";
import { Checkbox, Text, TextInput, Modal, Select } from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { ROLES } from "../../../utils/constants";
import IconButton from "../../../common/components/IconButton";
import { useSchoolDataMutations } from "../../../hooks/api/useSchoolData";
import { useSchoolStudentTeams, useSchoolTeams } from "../../../hooks/api/useSchoolData";
import { useActiveFilters } from "../../../common/hooks/useActiveFilters";
import Loading from "../../../common/components/Loading";
import EntityHeader from "../components/EntityHeader";

export default function SingleStudentView({ selectedStudent, schoolRole }) {
  const { updateStudent } = useSchoolDataMutations();
  
  const { data: allStudentTeams = [], isPending: isStudentTeamsPending } = useSchoolStudentTeams(selectedStudent.school_id);
  const { data: allTeams = [], isPending: isTeamsPending } = useSchoolTeams(selectedStudent.school_id);

  const { active: activeTeams } = useActiveFilters(allTeams);
  const currentTeam = allStudentTeams.find((t) => t.student_id === selectedStudent.id && t.is_active);

  const [opened, { open, close }] = useDisclosure(false, {
    onOpen: () => editStudentForm.setValues({
      name: selectedStudent.name,
      active: selectedStudent.is_active,
      teamId: currentTeam?.team_id?.toString() || "null"
    }),
    onClose: () => editStudentForm.reset(),
  });

  const editStudentForm = useForm({
    mode: "uncontrolled",
    validate: {
      name: hasLength({ min: 2, max: 40 }, "Must be 2-40 characters"),
    },
    validateInputOnBlur: true,
    onSubmitPreventDefault: "always",
  });

  if (isStudentTeamsPending || isTeamsPending) return <Loading />;

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
        newTeamId : teamChanged ? parsedTeamId : undefined,
        originalTeamId: originalTeamId,
        schoolId: selectedStudent.school_id,
      });
      close();
    } catch (error) {
      console.error("Student update failed:", error);
    }
  }

  const teamOptions = [
    { value: "null", label: "None" },
    ...activeTeams.map((t) => ({
      value: t.id.toString(),
      label: t.name,
    })),
  ];

  const teamItem = currentTeam ? (
    <Link to={`/schools?schoolId=${selectedStudent.school_id}&teamId=${currentTeam.team_id}`}>{currentTeam.teams.name}</Link>
  ) : (
    "None"
  );

  const detailItems = [
    `Status: ${selectedStudent.is_active ? "Active" : "Inactive"}`,
    <Text>Current Team: {teamItem}</Text>
  ];
  
  return (
    <>
      <EntityHeader title={selectedStudent.name} canEdit={[ROLES.PRIMARY, ROLES.ADMIN].includes(schoolRole)} onEdit={open} />
      {[ROLES.PRIMARY, ROLES.ADMIN].includes(schoolRole) && (
        <Modal opened={opened} onClose={close} title="Edit Student" centered={true}>
          <form onSubmit={editStudentForm.onSubmit(
            handleEditStudentSubmit,
            (errors) => {
              const firstErrorPath = Object.keys(errors)[0];
              editStudentForm.getInputNode(firstErrorPath)?.focus();
            }
          )}
          >
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
              allowDeselect={false}
              data={teamOptions}
              {...editStudentForm.getInputProps("teamId")}
            />
            <br />
            <Checkbox
              label="Active"
              style={{ cursor: "pointer" }}
              {...editStudentForm.getInputProps("active", {
                type: "checkbox"
              })}
            />
            <br />
            <IconButton icon="save" type="submit" buttonText="Submit" />
          </form>
        </Modal>
      )}
      <List items={detailItems} />
    </>
  );
}
