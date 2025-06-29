// Dependency imports
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Flex, Text } from "@mantine/core";
import { hasLength, isNotEmpty, useForm, isInRange } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks";

// Component imports
import EntityHeader from "../components/EntityHeader";
import FormModal from "../../../common/components/FormModal";
import TeamStudentList from "../components/lists/SingleTeam/TeamStudentList";
import TeamTournamentList from "../components/lists/SingleTeam/TeamTournamentList";
import { AddIcon } from "../../../common/components/ActionIcons";
import List from "../../../common/components/List";
import Loading from "../../../common/components/Loading";

// Utils imports
import { ROLES } from "../../../utils/constants";
import { TYPES } from "../utils/schoolConstants";

// Hooks imports
import { useSchoolDataMutations, useSchoolTournaments, useSchoolTeamsTournaments, useSchoolStudents, useSchoolStudentTeams } from "../../../hooks/api/useSchoolData";
import { useCases } from "../../../hooks/api/useCases";
import { useStudentTeamFilters, useTournamentTeamFilters } from "../hooks/useTeamFilters";
import { useActiveFilters } from "../../../common/hooks/useActiveFilters";

export default function SingleTeamView({ selectedTeam, schoolRole, schoolName }) {
  const { updateTeam, updateStudent, addTeamToTournament, deleteTeam } = useSchoolDataMutations();

  const navigate = useNavigate();

  const { data: allCases = [], isPending: isCasesPending } = useCases();
  const { data: allTournaments = [], isPending: isTournamentsPending } = useSchoolTournaments(selectedTeam.school_id);
  const { data: allTeamsTournaments = [], isPending: isTeamsTournamentsPending } = useSchoolTeamsTournaments(selectedTeam.school_id);
  const { data: allStudents = [], isPending: isStudentsPending } = useSchoolStudents(selectedTeam.school_id);
  const { data: allStudentTeams = [], isPending: isStudentTeamsPending } = useSchoolStudentTeams(selectedTeam.school_id);

  const linkedCase = useMemo(() => allCases.find((c) => c.id === selectedTeam.case_id), [allCases, selectedTeam]);
  const filteredStudents = useStudentTeamFilters({ teamId: selectedTeam.id, allStudentTeams })
    .sort((a, b) => a.students.name.localeCompare(b.students.name));

  const filteredTournaments = useTournamentTeamFilters({ teamId: selectedTeam.id, allTeamsTournaments })
    .sort((a, b) => a.tournaments.name.localeCompare(b.tournaments.name));

  const { active: allActiveStudents } = useActiveFilters(allStudents);
  const { active: allActiveTournaments } = useActiveFilters(allTournaments);

  const [editOpened, { open: editOpen, close: editClose }] = useDisclosure(false, {
    onOpen: () => editTeamForm.setValues({
      name: selectedTeam.name,
      year: selectedTeam.year,
      active: selectedTeam.is_active,
      type: selectedTeam.type,
      caseId: linkedCase?.id?.toString() || "null"
    }),
    onClose: () => editTeamForm.reset(),
  });

  function deleteTeamModal () {
    modals.openConfirmModal({
      title: `Delete Team: ${selectedTeam.name}`,
      centered: true,
      children: (
        <Text>
          Are you sure you want to delete {selectedTeam.name} from {schoolName}?
          <br />
          This action is not reversible and data cannot be recovered. All data, including ballots, will be 100% removed.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      onConfirm: async () => {
        try {
          await deleteTeam({
            teamId: selectedTeam.id,
            schoolId: selectedTeam.school_id
          });
          modals.closeAll();
          navigate(`/schools?schoolId=${selectedTeam.school_id}`);
        } catch (error) {
          console.error("Team deletion failed:", error);
        }
      }
    })
  }

  const [addStudentOpened, { open: addStudentOpen, close: addStudentClose }] = useDisclosure(false, {
    onClose: () => addStudentForm.reset()
  });

  const [addTournamentOpened, { open: addTournamentOpen, close: addTournamentClose }] = useDisclosure(false, {
    onClose: () => addTournamentForm.reset()
  });

  const editTeamForm = useForm({
    mode: "uncontrolled",
    validate: {
      name: hasLength({ min: 1, max: 15 }, "Must be 1-15 characters"),
      year: isInRange({ min: 1985, max: new Date().getFullYear() }, "Enter a valid year"),
      caseId: isNotEmpty("Select an option")
    },
    validateInputOnBlur: true,
    onSubmitPreventDefault: "always"
  });

  const addStudentForm = useForm({
    mode: "uncontrolled",
    validate: {
      studentId: isNotEmpty("Must select a student to add")
    },
    validateInputOnBlur: true,
    onSubmitPreventDefault: "always"
  });

  const addTournamentForm = useForm({
    mode: "uncontrolled",
    validate: {
      tournamentId: isNotEmpty("Must select a tournament to add")
    },
    validateInputOnBlur: true,
    onSubmitPreventDefault: "always"
  });

  const filteredActiveStudents = useMemo(() =>
    allActiveStudents.filter(activeStudent => 
      !allStudentTeams.some(studentTeam => 
        studentTeam.student_id === activeStudent.id &&
        studentTeam.team_id === selectedTeam.id &&
        studentTeam.is_active === true
      )
    ),
    [allActiveStudents, allStudentTeams, selectedTeam.id]
  );

  const filteredActiveTournaments = useMemo(() => 
    allActiveTournaments.filter(activeTournament => 
      !allTeamsTournaments.some(teamTournament => 
        teamTournament.tournament_id === activeTournament.id &&
        teamTournament.team_id === selectedTeam.id
      )
    ),
    [allActiveTournaments, allTeamsTournaments, selectedTeam.id]
  );

  const getCaseOptions = useMemo(() => [
      { value: "null", label: "None" },
      ...allCases.map((c) => ({
        value: c.id.toString(),
        label: c.name,
      }))
    ],
    [allCases]
  );

  const getStudentOptions = useMemo(() => 
    filteredActiveStudents
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((s) => {
        const currentTeam = allStudentTeams.find(st => st.student_id === s.id && st.is_active);
        const teamName = currentTeam ? currentTeam.teams.name : null;

        return {
          value: s.id.toString(),
          label: teamName ? `${s.name} (Currently assigned to: ${teamName})` : s.name
        }
      }),
    [filteredActiveStudents, allStudentTeams]
  );

  const getTournamentOptions = useMemo(() => 
    filteredActiveTournaments
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((t) => ({
        value: t.id.toString(),
        label: `${t.name} (${t.year})`
      })),
      [filteredActiveTournaments]
  );

  if (isCasesPending || isTournamentsPending || isTeamsTournamentsPending || isStudentsPending || isStudentTeamsPending) return <Loading />

  async function handleEditTeamSubmit (values) {
    const { name, active, type, year, caseId } = values;
    const originalName = selectedTeam.name;
    const originalActive = selectedTeam.is_active;
    const originalType = selectedTeam.type;
    const originalYear = selectedTeam.year;
    const originalCaseId = selectedTeam?.case_id;

    const parsedCaseId = caseId === "null" ? null : Number(caseId);

    const nameChanged = name !== originalName;
    const statusChanged = active !== originalActive;
    const typeChanged = type !== originalType;
    const yearChanged = year !== originalYear;
    const caseChanged = parsedCaseId !== originalCaseId;

    if (!nameChanged && !statusChanged && !typeChanged && !yearChanged && !caseChanged) {
      editClose();
      return;
    }

    try {
      await updateTeam({
        is_active: statusChanged ? active : undefined,
        name: nameChanged ? name : undefined,
        type: typeChanged ? type : undefined,
        schoolId: selectedTeam.school_id,
        teamId: selectedTeam.id,
        year: yearChanged ? year : undefined,
        caseId: caseChanged ? parsedCaseId : undefined,
      });
      editClose();
    } catch (error) {
      console.error("Team update failed:", error);
    }
  }

  async function handleAddStudentSubmit (values) {
    const { studentId } = values;
    const parsedStudentId = Number(studentId);

    const oldTeamId = allStudentTeams.find((t) => t.student_id === parsedStudentId && t.is_active === true)?.team_id || undefined;

    try {
      await updateStudent({
        studentId: parsedStudentId,
        name: undefined,
        is_active: undefined,
        newTeamId: selectedTeam.id,
        originalTeamId: oldTeamId,
      });
      addStudentClose();
    } catch (error) {
      console.error("Student add failed:", error);
    }
  }

  async function handleAddTournamentSubmit (values) {
    const { tournamentId } = values;
    const parsedTournamentId = Number(tournamentId);

    try {
      await addTeamToTournament({
        tournamentId: parsedTournamentId,
        schoolId: selectedTeam.school_id,
        teamId: selectedTeam.id,
      });
      addTournamentClose();
    } catch (error) {
      console.error("Tournament add failed:", error);
    }
  }

  const typeOptions = [
    { value: TYPES.PRESTACK, label: TYPES.PRESTACK },
    { value: TYPES.POSTSTACK, label: TYPES.POSTSTACK }
  ];

  const caseItem = selectedTeam.case_id ? <Link to={`/cases?caseId=${selectedTeam.case_id}`}>{linkedCase.name}</Link> : "None";

  const detailItems = [
    `Type: ${selectedTeam.type}`,
    `Status: ${selectedTeam.is_active ? "Active" : "Inactive"}`,
    `Year: ${selectedTeam.year}`,
    <Text>Linked Case: {caseItem}</Text>
  ];

  const editTeamModalProps = {
    opened: editOpened,
    onClose: editClose,
    title: "Edit Team",
    onSubmit: handleEditTeamSubmit,
    form: editTeamForm,
    fields: [
      {
        type: "text",
        name: "name",
        autofocus: true,
        placeholder: "Enter the team's name",
        required: true,
        label: "Name"
      },
      {
        type: "select",
        name: "type",
        required: true,
        label: "Type",
        options: typeOptions,
        searchable: false
      },
      {
        type: "number",
        name: "year",
        required: true,
        min: 1985,
        max: new Date().getFullYear(),
        label: "Year"
      },
      {
        type: "select",
        name: "caseId",
        required: true,
        label: "Linked Case",
        options: getCaseOptions
      },
      {
        type: "checkbox",
        name: "active",
        label: "Active"
      }
    ]
  };

  const addStudentModalProps = {
    opened: addStudentOpened,
    onClose: addStudentClose,
    title: "Add Student to Team",
    onSubmit: handleAddStudentSubmit,
    form: addStudentForm,
    fields: [
      {
        type: "select",
        name: "studentId",
        required: true,
        label: "Student to Add",
        options: getStudentOptions
      }
    ]
  }

  const addTournamentModalProps = {
    opened: addTournamentOpened,
    onClose: addTournamentClose,
    title: "Add Tournament to Team",
    onSubmit: handleAddTournamentSubmit,
    form: addTournamentForm,
    fields: [
      {
        type: "select",
        name: "tournamentId",
        required: true,
        label: "Tournament to Add",
        options: getTournamentOptions
      }
    ]
  }

  const hasEditPermissions = [ROLES.PRIMARY, ROLES.ADMIN].includes(schoolRole);
  const canAddStudent = hasEditPermissions && filteredActiveStudents.length > 0;
  const canAddTournament = hasEditPermissions && filteredActiveTournaments.length > 0;

  return (
    <>
      <EntityHeader title={selectedTeam.name} canEdit={[ROLES.PRIMARY, ROLES.ADMIN].includes(schoolRole)} onEdit={editOpen} canDelete={[ROLES.PRIMARY].includes(schoolRole)} onDelete={deleteTeamModal} />
      {hasEditPermissions && (
        <FormModal {...editTeamModalProps} />
      )}
      <List items={detailItems} />
      <br />
      <Flex style={{ alignItems: "center", gap: "7px" }}>
        <h2>Students Assigned to Team</h2>
        {canAddStudent && (
          <>
            <AddIcon onClick={addStudentOpen} />
            <FormModal {...addStudentModalProps} />
          </>
        )}
      </Flex>
      <TeamStudentList students={filteredStudents} schoolRole={schoolRole} />
      <Flex style={{ alignItems: "center", gap: "7px" }}>
        <h2>Tournaments Assigned to Team</h2>
        {canAddTournament && (
          <>
            <AddIcon onClick={addTournamentOpen} />
            <FormModal {...addTournamentModalProps} />
          </>
        )}
      </Flex>
      <TeamTournamentList tournaments={filteredTournaments} schoolRole={schoolRole} />
    </>
  );
}
