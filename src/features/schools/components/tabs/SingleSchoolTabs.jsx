// Dependency imports
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Text, Tooltip, SegmentedControl } from "@mantine/core";
import { hasLength, isInRange, isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";

// Component imports
import UserList from "../lists/SingleSchool/UserList";
import TeamList from "../lists/SingleSchool/TeamList";
import StudentList from "../lists/SingleSchool/StudentList";
import TournamentList from "../lists/SingleSchool/TournamentList";
import AddModal from "../AddModal";
import TabbedView from "../../../../common/components/TabbedView";
import IconButton from "../../../../common/components/IconButton";
import Loading from "../../../../common/components/Loading";

// Utils imports
import { PREMIUM_LIMITS, ROLES } from "../../../../utils/constants";
import { TYPES, AREAS } from "../../utils/schoolConstants";

// Hooks imports
import { useRoleFilters } from "../../hooks/useRoleFilters";
import { useSchoolDataMutations } from "../../../../hooks/api/useSchoolData";
import { useCases } from "../../../../hooks/api/useCases";
import { useActiveFilters } from "../../../../common/hooks/useActiveFilters";

export default function SingleSchoolTabs({
  role,
  allTeams,
  allStudents,
  allTournaments,
  allUsers,
  isPremium,
  schoolId,
  schoolName,
  currentTab,
  setCurrentTab,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { active: activeTeams, inactive: inactiveTeams } = useActiveFilters(allTeams);
  const { active: activeStudents, inactive: inactiveStudents } = useActiveFilters(allStudents);
  const { active: activeTournaments, inactive: inactiveTournaments } =
    useActiveFilters(allTournaments);
  const { primary: primaryAdminUsers, admin: adminUsers, viewer: viewerUsers } = useRoleFilters(allUsers);

  const teamsFilter = searchParams.get("teamsfilter") || "active";
  const studentsFilter = searchParams.get("studentsfilter") || "active";
  const tournamentsFilter = searchParams.get("tournamentsfilter") || "active";

  const handleTeamFilterChange = (newFilter) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("teamsfilter", newFilter);
    setSearchParams(newSearchParams);
  }

  const handleStudentFilterChange = (newFilter) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("studentsfilter", newFilter);
    setSearchParams(newSearchParams);
  }

  const handleTournamentFilterChange = (newFilter) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("tournamentsfilter", newFilter);
    setSearchParams(newSearchParams);
  }

  const getFilteredTeams = () => {
    switch (teamsFilter) {
      case "active": return activeTeams;
      case "inactive": return inactiveTeams;
      case "all": return [...activeTeams, ...inactiveTeams];
      default: return activeTeams;
    }
  }

  const getFilteredStudents = () => {
    switch (studentsFilter) {
      case "active": return activeStudents;
      case "inactive": return inactiveStudents;
      case "all": return [...activeStudents, ...inactiveStudents];
      default: return activeStudents;
    }
  }

  const getFilteredTournaments = () => {
    switch (tournamentsFilter) {
      case "active": return activeTournaments;
      case "inactive": return inactiveTournaments;
      case "all": return [...activeTournaments, ...inactiveTournaments];
      default: return activeTournaments;
    }
  }

  const teamFilterOptions = [
    { label: "All", value: "all" },
    ...(activeTeams.length > 0 ? [{ label: "Active", value: "active" }] : [{ label: "Active", value: "active", disabled: true }]),
    ...(inactiveTeams.length > 0 ? [{ label: "Inactive", value: "inactive" }] : [{ label: "Inactive", value: "inactive", disabled: true }])
  ]

  const studentFilterOptions = [
    { label: "All", value: "all" },
    ...(activeStudents.length > 0 ? [{ label: "Active", value: "active" }] : [{ label: "Active", value: "active", disabled: true }]),
    ...(inactiveStudents.length > 0 ? [{ label: "Inactive", value: "inactive" }] : [{ label: "Inactive", value: "inactive", disabled: true }])
  ]

  const tournamentFilterOptions = [
    { label: "All", value: "all" },
    ...(activeTournaments.length > 0 ? [{ label: "Active", value: "active" }] : [{ label: "Active", value: "active", disabled: true }]),
    ...(inactiveTournaments.length > 0 ? [{ label: "Inactive", value: "inactive" }] : [{ label: "Inactive", value: "inactive", disabled: true }])
  ]

  const currentTeamFilter = (teamsFilter === "inactive" && inactiveTeams.length === 0) || (teamsFilter === "active" && activeTeams.length === 0) ? "all" : teamsFilter;
  const currentStudentFilter = (studentsFilter === "inactive" && inactiveStudents.length === 0) || (studentsFilter === "active" && activeStudents.length === 0) ? "all" : studentsFilter;
  const currentTournamentFilter = (tournamentsFilter === "inactive" && inactiveTournaments.length === 0) || (tournamentsFilter === "active" && activeTournaments.length === 0) ? "all" : tournamentsFilter;

  const { addTeam, addStudent, addTournament } = useSchoolDataMutations();

  const { data: allCases = [], isPending: isCasesPending } = useCases();

  const [addTeamOpened, { open: addTeamOpen, close: addTeamClose }] = useDisclosure(false, {
    onOpen: () => addTeamForm.setValues({
      year: new Date().getFullYear(),
      caseId: "null",
      type: TYPES.PRESTACK
    }),
    onClose: () => addTeamForm.reset(),
  });

  const [addStudentOpened, { open: addStudentOpen, close: addStudentClose }] = useDisclosure(false, {
    onClose: () => addStudentForm.reset(),
  });

  const [addTournamentOpened, { open: addTournamentOpen, close: addTournamentClose }] = useDisclosure(false, {
    onOpen: () => addTournamentForm.setValues({
      year: new Date().getFullYear(),
      caseId: allCases[0].id.toString(),
      type: TYPES.PRESTACK,
      area: AREAS.INVITATIONAL
    }),
    onClose: () => addTournamentForm.reset()
  });

  const addTeamForm = useForm({ 
    mode: "uncontrolled",
    validate: {
      name: hasLength({ min: 1, max: 15 }, "Must be 1-15 characters"),
      year: isInRange({ min: 1985, max: new Date().getFullYear() }, "Enter a valid year"),
      caseId: isNotEmpty("Select an option"),
      type: isNotEmpty("Select an option")
    },
    validateInputOnBlur: true,
    onSubmitPreventDefault: "always"
  });

  const addStudentForm = useForm({
    mode: "uncontrolled",
    validate: {
      name: hasLength({ min: 2, max: 40 }, "Must be 2-40 characters")
    },
    validateInputOnBlur: true,
    onSubmitPreventDefault: "always"
  });

  const addTournamentForm = useForm({
    mode: "uncontrolled",
    validate: {
      name: hasLength({ min: 2, max: 40 }, "Must be 2-40 characters"),
      year: isInRange({ min: 1985, max: new Date().getFullYear() }, "Enter a valid year"),
      caseId: isNotEmpty("Select an option"),
      type: isNotEmpty("Select an option"),
      area: isNotEmpty("Select an option")
    },
    validateInputOnBlur: true,
    onSubmitPreventDefault: "always"
  });

  const getCaseOptions = useMemo(() => [
      { value: "null", label: "None" },
      ...allCases.map((c) => ({
        value: c.id.toString(),
        label: c.name,
      }))
    ],
    [allCases]
  );

  if (isCasesPending) return <Loading />;

  async function handleAddTeamSubmit (values) {
    const { name, type, year, caseId } = values;

    const parsedCaseId = caseId === "null" ? null : Number(caseId);

    try {
      await addTeam({
        name,
        type,
        year,
        caseId: parsedCaseId,
        schoolId,
      });
      addTeamClose();
    } catch (error) {
      console.error("Team add failed:", error);
    }
  }

  async function handleAddStudentSubmit (values) {
    const { name } = values;
    
    try {
      await addStudent({
        name,
        schoolId,
      });
      addStudentClose();
    } catch (error) {
      console.error("Student add failed:", error);
    }
  }

  async function handleAddTournamentSubmit (values) {
    const { name, year, type, area, caseId } = values;

    const parsedCaseId = caseId === "null" ? null : Number(caseId);

    try {
      await addTournament({
        name,
        year,
        type,
        area,
        caseId: parsedCaseId,
        schoolId,
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

  const areaOptions = [
    { value: AREAS.INVITATIONAL, label: AREAS.INVITATIONAL },
    { value: AREAS.REGIONALS, label: AREAS.REGIONALS },
    { value: AREAS.ORCS, label: AREAS.ORCS },
    { value: AREAS.NATIONALS, label: AREAS.NATIONALS },
    { value: AREAS.ROOKIERUMBLE, label: AREAS.ROOKIERUMBLE },
    { value: AREAS.OLT, label: AREAS.OLT },
    { value: AREAS.OTHER, label: AREAS.OTHER }
  ];

  const addTeamModalProps = {
    opened: addTeamOpened,
    onClose: addTeamClose,
    title: "Add Team to School",
    onSubmit: handleAddTeamSubmit,
    form: addTeamForm,
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
      }
    ]
  };

  const addStudentModalProps = {
    opened: addStudentOpened,
    onClose: addStudentClose,
    title: "Add Student to School",
    onSubmit: handleAddStudentSubmit,
    form: addStudentForm,
    fields: [
      {
        type: "text",
        name: "name",
        autofocus: true,
        placeholder: "Enter the student's name",
        required: true,
        label: "Name"
      },
    ]
  };

  const addTournamentModalProps = {
    opened: addTournamentOpened,
    onClose: addTournamentClose,
    title: "Add Tournament to School",
    onSubmit: handleAddTournamentSubmit,
    form: addTournamentForm,
    fields: [
      {
        type: "text",
        name: "name",
        autofocus: true,
        placeholder: "Enter the tournament's name",
        required: true,
        label: "Name"
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
        options: areaOptions
      },
      {
        type: "number",
        name: "year",
        required: true,
        min: 1985,
        max: new Date().getFullYear(),
        label: "Year",
      },
      {
        type: "select",
        name: "caseId",
        required: true,
        label: "Linked Case",
        options: getCaseOptions.filter((c) => c.value !== "null")
      }
    ]
  }

  const tabs = [];

  if (role === ROLES.PRIMARY) {
    const premiumTooltipLabel = "Upgrade to premium for unlimited spots";

    const tooltipProps = {
      inline: true,
      label: premiumTooltipLabel,
    };

    const userListProps = {
      isPremium,
      schoolId,
      schoolName,
    };

    tabs.push({
      value: "users",
      label: "School Users",
      content: (
        <>
          <br />
          <Text>To add additional users, please contact MSU Mock Trial.</Text>
          <h3>
            Primary Admins
            {isPremium ? (
              <span> ({primaryAdminUsers.length})</span>
            ) : (
              <Tooltip {...tooltipProps}>
                <span>
                  {" "}
                  ({primaryAdminUsers.length}/{PREMIUM_LIMITS.PRIMARY})
                </span>
              </Tooltip>
            )}
          </h3>
          <UserList users={primaryAdminUsers} {...userListProps} />
          <h3>
            Admins
            {isPremium ? (
              <span> ({adminUsers.length})</span>
            ) : (
              <Tooltip {...tooltipProps}>
                <span>
                  {" "}
                  ({adminUsers.length}/{PREMIUM_LIMITS.ADMIN})
                </span>
              </Tooltip>
            )}
          </h3>
          <UserList users={adminUsers} {...userListProps} />
          <h3>
            Viewers
            {isPremium ? (
              <span> ({viewerUsers.length})</span>
            ) : (
              <Tooltip {...tooltipProps}>
                <span>
                  {" "}
                  ({viewerUsers.length}/{PREMIUM_LIMITS.VIEWER})
                </span>
              </Tooltip>
            )}
          </h3>
          <UserList users={viewerUsers} {...userListProps} />
        </>
      ),
    });
  }

  const hasAddPermissions = [ROLES.PRIMARY, ROLES.ADMIN].includes(role);

  tabs.push(
    {
      value: "teams",
      label: "Teams",
      content: (
        <>
          <br />
          {hasAddPermissions && (
            <>
              <IconButton icon="add" buttonText="Add Team" onClick={addTeamOpen} />
              <AddModal {...addTeamModalProps} />
              <br />
              <br />
            </>
          )}
          <SegmentedControl
            value={currentTeamFilter}
            onChange={handleTeamFilterChange}
            data={teamFilterOptions}
            mb="md"
            disabled={allTeams.length > 0 ? false : true}
          />
          <TeamList teams={getFilteredTeams()} />
        </>
      ),
    },
    {
      value: "students",
      label: "Students",
      content: (
        <>
          <br />
          {hasAddPermissions && (
            <>
              <IconButton icon="add" buttonText="Add Student" onClick={addStudentOpen} />
              <AddModal {...addStudentModalProps} />
              <br />
              <br />
            </>
          )}
          <SegmentedControl
            value={currentStudentFilter}
            onChange={handleStudentFilterChange}
            data={studentFilterOptions}
            mb="md"
            disabled={allStudents.length > 0 ? false : true}
          />
          <StudentList students={getFilteredStudents()} />
        </>
      ),
    },
    {
      value: "tournaments",
      label: "Tournaments",
      content: (
        <>
          <br />
          {hasAddPermissions && (
            <>
              <IconButton icon="add" buttonText="Add Tournament" onClick={addTournamentOpen} />
              <AddModal {...addTournamentModalProps} />
              <br />
              <br />
            </>
          )}
          <SegmentedControl
            value={currentTournamentFilter}
            onChange={handleTournamentFilterChange}
            data={tournamentFilterOptions}
            mb="md"
            disabled={allTournaments.length > 0 ? false : true}
          />
          <TournamentList tournaments={getFilteredTournaments()} />
        </>
      ),
    }
  );

  return (
    <TabbedView
      tabs={tabs}
      defaultTab={currentTab}
      onTabChange={setCurrentTab}
    />
  );
}
