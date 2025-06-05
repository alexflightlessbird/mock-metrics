// Dependency imports
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Flex, Text } from "@mantine/core";
import { hasLength, isInRange, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks";

// Component imports
import EntityHeader from "../components/EntityHeader";
import EditModal from "../components/EditModal";
import AddModal from "../components/AddModal";
import TournamentTeamList from "../components/lists/SingleTournament/TournamentTeamList";
import { AddIcon } from "../../../common/components/ActionIcons";
import List from "../../../common/components/List";
import Loading from "../../../common/components/Loading";

// Utils imports
import { ROLES } from "../../../utils/constants";
import { TYPES, AREAS } from "../utils/schoolConstants";

// Hooks imports
import { useSchoolDataMutations, useSchoolTeamsTournaments, useSchoolTeams } from "../../../hooks/api/useSchoolData";
import { useCases } from "../../../hooks/api/useCases";
import { useTournamentFilters } from "../hooks/useTournamentFilters";
import { useActiveFilters } from "../../../common/hooks/useActiveFilters";

export default function SingleTournamentView({ selectedTournament, schoolRole, schoolName }) {
  const { updateTournament, addTeamToTournament, deleteTournament } = useSchoolDataMutations();

  const navigate = useNavigate();

  const { data: allCases = [], isPending: isCasesPending } = useCases();
  const { data: allTeams = [], isPending: isTeamsPending } = useSchoolTeams(selectedTournament.school_id);
  const { data: allTeamsTournaments = [], isPending: isTeamsTournamentsPending } = useSchoolTeamsTournaments(selectedTournament.school_id);
  
  const linkedCase = useMemo(() => allCases.find((c) => c.id === selectedTournament.case_id), [allCases, selectedTournament]);
  const filteredTeams = useTournamentFilters({ tournamentId: selectedTournament.id, allTeamsTournaments })
    .sort((a, b) => a.teams.name.localeCompare(b.teams.name));

  const { active: allActiveTeams } = useActiveFilters(allTeams);

  const [editOpened, { open: editOpen, close: editClose }] = useDisclosure(false, {
    onOpen: () => editTournamentForm.setValues({
      name: selectedTournament.name,
      active: selectedTournament.is_active,
      year: selectedTournament.year,
      type: selectedTournament.type,
      area: selectedTournament.area,
      caseId: linkedCase.id.toString()
    }),
    onClose: () => editTournamentForm.reset(),
  });

  function deleteTournamentModal () {
    modals.openConfirmModal({
      title: `Delete Tournament: ${selectedTournament.name}`,
      centered: true,
      children: (
        <Text>
          Are you sure you want to delete {selectedTournament.name} from {schoolName}?
          <br />
          This action is not reversible and data cannot be recovered. All data, including ballots, will be 100% removed.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      onConfirm: async () => {
        try {
          await deleteTournament({
            tournamentId: selectedTournament.id,
            schoolId: selectedTournament.school_id
          });
          modals.closeAll();
          navigate(`/schools?schoolId=${selectedTournament.school_id}`);
        } catch (error) {
          console.error("Tournament deletion failed:", error);
        }
      }
    })
  }

  const [addOpened, { open: addOpen, close: addClose }] = useDisclosure(false, {
    onClose: () => addTeamForm.reset()
  });

  const editTournamentForm = useForm({
    mode: "uncontrolled",
    validate: {
      name: hasLength({ min: 2, max: 40 }, "Must be 2-40 characters"),
      year: isInRange({ min: 1985, max: new Date().getFullYear() }, "Enter a valid year")
    },
    validateInputOnBlur: true,
    onSubmitPreventDefault: "always",
  });

  const addTeamForm = useForm({
    mode: "uncontrolled",
    validate: {
      teamId: isNotEmpty("Must select a team to add")
    },
    validateInputOnBlur: true,
    onSubmitPreventDefault: "always"
  });

  const filteredActiveTeams = useMemo(() => 
    allActiveTeams.filter(activeTeam => 
      !allTeamsTournaments.some(teamTournament => 
        teamTournament.team_id === activeTeam.id &&
        teamTournament.tournament_id === selectedTournament.id
      )
    ),
    [allActiveTeams, allTeamsTournaments, selectedTournament.id]
  );

  const getCaseOptions = useMemo(() => 
    allCases.map((c) => ({
      value: c.id.toString(),
      label: c.name,
    })),
    [allCases]
  );

  const getTeamOptions = useMemo(() => 
    filteredActiveTeams
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((t) => ({
        value: t.id.toString(),
        label: t.name
      })),
    [filteredActiveTeams]
  );

  if (isCasesPending || isTeamsTournamentsPending || isTeamsPending) return <Loading />;
  
  async function handleEditTournamentSubmit (values) {
    const { name, active, year, type, area, caseId } = values;
    const originalName = selectedTournament.name;
    const originalActive = selectedTournament.active;
    const originalYear = selectedTournament.year;
    const originalType = selectedTournament.type;
    const originalArea = selectedTournament.area;
    const originalCaseId = selectedTournament.case_id;

    const parsedCaseId = Number(caseId);

    const nameChanged  = name !== originalName;
    const statusChanged = active !== originalActive;
    const yearChanged = year !== originalYear;
    const typeChanged = type !== originalType;
    const areaChanged = area !== originalArea;
    const caseChanged = parsedCaseId !== originalCaseId;

    if (!nameChanged && !statusChanged && !yearChanged && !typeChanged && !areaChanged && !caseChanged) {
      editClose();
      return;
    }

    try {
      await updateTournament({
        tournamentId: selectedTournament.id,
        schoolId: selectedTournament.school_id,
        year: yearChanged ? year : undefined,
        type: typeChanged ? type : undefined,
        name: nameChanged ? name : undefined,
        area: areaChanged ? area : undefined,
        is_active: statusChanged ? active : undefined,
        caseId: caseChanged ? parsedCaseId : undefined,
      });
      editClose();
    } catch (error) {
      console.error("Tournament update failed:", error);
    }
  }

  async function handleAddTeamSubmit (values) {
    const { teamId } = values;
    const parsedTeamId = Number(teamId);

    try {
      await addTeamToTournament({
        tournamentId: selectedTournament.id,
        schoolId: selectedTournament.school_id,
        teamId: parsedTeamId,
      });
      addClose();
    } catch (error) {
      console.error("Team add failed:", error);
    }

  }

  const typeOptions = [
    { value: TYPES.PRESTACK, label: TYPES.PRESTACK },
    { value: TYPES.POSTSTACK, label: TYPES.POSTSTACK }
  ];

  const areaOptions = [
    { value: AREAS.INVITATIONAL, label: AREAS.INVITATIONAL },
    { value: AREAS.REGIONALS, label: AREAS.REGIONALS },
    { value: AREAS.ORCS, label: AREAS.ORCS },
    { value: AREAS.NATIONALS, label: AREAS.NATIONALS },
    { value: AREAS.ROOKIERUMBLE, label: AREAS.ROOKIERUMBLE },
    { value: AREAS.OLT, label: AREAS.OLT },
    { value: AREAS.OTHER, label: AREAS.OTHER }
  ];

  const caseItem = <Link to={`/cases?caseId=${selectedTournament.case_id}`}>{linkedCase.name}</Link>;

  const detailItems = [
    `Year: ${selectedTournament.year}`,
    `Type: ${selectedTournament.type}`,
    `Area: ${selectedTournament.area}`,
    `Status: ${selectedTournament.is_active ? "Active" : "Inactive"}`,
    <Text>Linked Case: {caseItem}</Text>
  ];

  const editModalProps = {
    opened: editOpened,
    onClose: editClose,
    title: "Edit Tournament",
    onSubmit: handleEditTournamentSubmit,
    form: editTournamentForm,
    fields: [
      {
        type: "text",
        name: "name",
        autofocus: true,
        placeholder: "Enter the tournament's name",
        required: true,
        label: "Name",
      },
      {
        type: "select",
        name: "type",
        required: true,
        label: "Type",
        options: typeOptions,
        searchable: false,
      },
      {
        type: "select",
        name: "area",
        required: true,
        label: "Area",
        options: areaOptions,
        searchable: false,
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

  const addModalProps = {
    opened: addOpened,
    onClose: addClose,
    title: "Add Team to Tournament",
    onSubmit: handleAddTeamSubmit,
    form: addTeamForm,
    fields: [
      {
        type: "select",
        name: "teamId",
        required: true,
        label: "Team to Add",
        options: getTeamOptions
      }
    ]
  };

  const hasEditPermissions = [ROLES.PRIMARY, ROLES.ADMIN].includes(schoolRole);
  const canAddTeam = hasEditPermissions && filteredActiveTeams.length > 0;

  return (
    <>
      <EntityHeader title={selectedTournament.name} canEdit={hasEditPermissions} onEdit={editOpen} canDelete={[ROLES.PRIMARY].includes(schoolRole)} onDelete={deleteTournamentModal} />
      {hasEditPermissions && (
        <EditModal {...editModalProps} />
      )}
      <List items={detailItems} />
      <br />
      <Flex style={{ alignItems: "center", gap: "7px" }}>
        <h2>Teams Assigned to Tournament</h2>
        {canAddTeam && (
          <>
            <AddIcon onClick={addOpen} />
            <AddModal {...addModalProps} />
          </>
        )}
      </Flex>
      <TournamentTeamList teams={filteredTeams} schoolRole={schoolRole} schoolId={selectedTournament.school_id} tournamentId={selectedTournament.id} pSide={linkedCase.type === "Civil" ? "Plaintiff" : "Prosecution"} />
    </>
  );
}
