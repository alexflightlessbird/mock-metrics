import { useMemo } from "react";
import List from "../../../common/components/List";
import { Flex } from "@mantine/core";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { ROLES } from "../../../utils/constants";
import { TYPES } from "../utils/schoolConstants";
import { useSchoolDataMutations, useSchoolTournaments, useSchoolTeamsTournaments, useSchoolStudents, useSchoolStudentTeams } from "../../../hooks/api/useSchoolData";
import { useStudentTeamFilters, useTournamentTeamFilters } from "../hooks/useTeamFilters";
import EntityHeader from "../components/EntityHeader";
import EditModal from "../components/EditModal";
import Loading from "../../../common/components/Loading";
import { useActiveFilters } from "../../../common/hooks/useActiveFilters";
import { AddIcon } from "../../../common/components/ActionIcons";
import AddModal from "../components/AddModal";
import TeamStudentList from "../components/lists/TeamStudentList";
import TeamTournamentList from "../components/lists/TeamTournamentList";

export default function SingleTeamView({ selectedTeam, schoolRole }) {
  const { updateTeam, updateStudent, addTeamToTournament } = useSchoolDataMutations();

  const { data: allTournaments = [], isPending: isTournamentsPending } = useSchoolTournaments(selectedTeam.school_id);
  const { data: allTeamsTournaments = [], isPending: isTeamsTournamentsPending } = useSchoolTeamsTournaments(selectedTeam.school_id);
  const { data: allStudents = [], isPending: isStudentsPending } = useSchoolStudents(selectedTeam.school_id);
  const { data: allStudentTeams = [], isPending: isStudentTeamsPending } = useSchoolStudentTeams(selectedTeam.school_id);

  const filteredStudents = useStudentTeamFilters({ teamId: selectedTeam.id, allStudentTeams })
    .sort((a, b) => a.students.name.localeCompare(b.students.name));

  const filteredTournaments = useTournamentTeamFilters({ teamId: selectedTeam.id, allTeamsTournaments })
    .sort((a, b) => a.tournaments.name.localeCompare(b.tournaments.name));

  const { active: allActiveStudents } = useActiveFilters(allStudents);
  const { active: allActiveTournaments } = useActiveFilters(allTournaments);

  const [editOpened, { open: editOpen, close: editClose }] = useDisclosure(false, {
    onOpen: () => editTeamForm.setValues({
      name: selectedTeam.name,
      active: selectedTeam.is_active,
      type: selectedTeam.type,
    }),
    onClose: () => editTeamForm.reset(),
  });

  const [addStudentOpened, { open: addStudentOpen, close: addStudentClose }] = useDisclosure(false, {
    onClose: () => addStudentForm.reset()
  });

  const [addTournamentOpened, { open: addTournamentOpen, close: addTournamentClose }] = useDisclosure(false, {
    onClose: () => addTournamentForm.reset()
  });

  const editTeamForm = useForm({
    mode: "uncontrolled",
    validate: {
      name: hasLength({ min: 1, max: 15 }, "Must be 1-15 characters")
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

  if (isTournamentsPending || isTeamsTournamentsPending || isStudentsPending || isStudentTeamsPending) return <Loading />

  const handleEditTeamSubmit = async (values) => {
    const { name, active, type } = values;
    const originalName = selectedTeam.name;
    const originalActive = selectedTeam.is_active;
    const originalType = selectedTeam.type;

    const nameChanged = name !== originalName;
    const statusChanged = active !== originalActive;
    const typeChanged = type !== originalType;

    if (!nameChanged && !statusChanged && !typeChanged) {
      close();
      return;
    }

    try {
      await updateTeam({
        is_active: statusChanged ? active : undefined,
        name: nameChanged ? name : undefined,
        type: typeChanged ? type : undefined,
        schoolId: selectedTeam.school_id,
        teamId: selectedTeam.id,
      });
      close();
    } catch (error) {
      console.error("Team update failed:", error);
    }
  }

  const handleAddStudentSubmit = async (values) => {
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

  const handleAddTournamentSubmit = async (values) => {
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

  const detailItems = [
    `Type: ${selectedTeam.type}`,
    `Status: ${selectedTeam.is_active ? "Active" : "Inactive"}`
  ];

  const editModalProps = {
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
        options: typeOptions
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
      <EntityHeader title={selectedTeam.name} canEdit={[ROLES.PRIMARY, ROLES.ADMIN].includes(schoolRole)} onEdit={editOpen} />
      {hasEditPermissions && (
        <EditModal {...editModalProps} />
      )}
      <List items={detailItems} />
      <br />
      <Flex style={{ alignItems: "center", gap: "7px" }}>
        <h2>Students Assigned to Team</h2>
        {canAddStudent && (
          <>
            <AddIcon onClick={addStudentOpen} />
            <AddModal {...addStudentModalProps} />
          </>
        )}
      </Flex>
      <TeamStudentList students={filteredStudents} schoolRole={schoolRole} />
      <Flex style={{ alignItems: "center", gap: "7px" }}>
        <h2>Tournaments Assigned to Team</h2>
        {canAddTournament && (
          <>
            <AddIcon onClick={addTournamentOpen} />
            <AddModal {...addTournamentModalProps} />
          </>
        )}
      </Flex>
      <TeamTournamentList tournaments={filteredTournaments} schoolRole={schoolRole} />
    </>
  );
}
