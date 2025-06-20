// Dependency imports
import { Link, useNavigate } from "react-router-dom";
import { Text } from "@mantine/core";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks";

// Component imports
import EntityHeader from "../components/EntityHeader";
import ModalForm from "../../../common/components/FormModal";
import List from "../../../common/components/List";
import Loading from "../../../common/components/Loading";

// Utils imports
import { ROLES } from "../../../utils/constants";

// Hooks imports
import { useSchoolDataMutations } from "../../../hooks/api/useSchoolData";
import { useSchoolStudentTeams, useSchoolTeams } from "../../../hooks/api/useSchoolData";
import { useActiveFilters } from "../../../common/hooks/useActiveFilters";

export default function SingleStudentView({ selectedStudent, schoolRole, schoolName }) {
  const { updateStudent, deleteStudent } = useSchoolDataMutations();

  const navigate = useNavigate();
  
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

  function deleteStudentModal () {
    modals.openConfirmModal({
      title: `Delete Student: ${selectedStudent.name}`,
      centered: true,
      children: (
        <Text>
          Are you sure you want to delete {selectedStudent.name} from {schoolName}?
          <br />
          This action is not reversible and data cannot be recovered. All data, including roles on ballots assigned to this student, will be 100% removed.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      onConfirm: async () => {
        try {
          await deleteStudent({
            studentId: selectedStudent.id,
            schoolId: selectedStudent.school_id
          });
          modals.closeAll();
          navigate(`/schools?schoolId=${selectedStudent.school_id}`);
        } catch (error) {
          console.error("Student deletion failed:", error);
        }
      }
    })
  }

  const editStudentForm = useForm({
    mode: "uncontrolled",
    validate: {
      name: hasLength({ min: 2, max: 40 }, "Must be 2-40 characters"),
      teamId: isNotEmpty("Select an option")
    },
    validateInputOnBlur: true,
    onSubmitPreventDefault: "always",
  });

  if (isStudentTeamsPending || isTeamsPending) return <Loading />;

  async function handleEditStudentSubmit (values) {
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

  const modalProps = {
    opened,
    onClose: close,
    title: "Edit Student",
    onSubmit: handleEditStudentSubmit,
    form: editStudentForm,
    fields: [
      {
        type: "text",
        name: "name",
        autofocus: true,
        placeholder: "Enter the student's name",
        required: true,
        label: "Name",
      },
      {
        type: "select",
        name: "teamId",
        label: "Assigned Team",
        options: teamOptions,
        required: true,
      },
      {
        type: "checkbox",
        name: "active",
        label: "Active"
      }
    ]
  }
  
  return (
    <>
      <EntityHeader title={selectedStudent.name} canEdit={[ROLES.PRIMARY, ROLES.ADMIN].includes(schoolRole)} onEdit={open} canDelete={[ROLES.PRIMARY].includes(schoolRole)} onDelete={deleteStudentModal} />
      {[ROLES.PRIMARY, ROLES.ADMIN].includes(schoolRole) && (
        <ModalForm {...modalProps} />
      )}
      <List items={detailItems} />
    </>
  );
}
