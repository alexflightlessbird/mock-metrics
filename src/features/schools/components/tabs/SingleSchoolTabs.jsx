// Dependency imports
import { useMemo } from "react";
import { Text, Tooltip } from "@mantine/core";
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
  const { active: activeTeams, inactive: inactiveTeams } = useActiveFilters(allTeams);
  const { active: activeStudents, inactive: inactiveStudents } = useActiveFilters(allStudents);
  const { active: activeTournaments, inactive: inactiveTournaments } =
    useActiveFilters(allTournaments);
  const { primary: primaryAdminUsers, admin: adminUsers, viewer: viewerUsers } = useRoleFilters(allUsers);

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
        options: typeOptions
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
        options: typeOptions
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

  const teamTabs = [
    {
      value: "active",
      label: "Active Teams",
      content: (
        <>
          <br />
          <TeamList teams={activeTeams} />
        </>
      ),
    },
    {
      value: "inactive",
      label: "Inactive Teams",
      content: (
        <>
          <br />
          <TeamList teams={inactiveTeams} />
        </>
      ),
    },
  ];

  const studentTabs = [
    {
      value: "active",
      label: "Active Students",
      content: (
        <>
          <br />
          <StudentList students={activeStudents} />
        </>
      ),
    },
    {
      value: "inactive",
      label: "Inactive Students",
      content: (
        <>
          <br />
          <StudentList students={inactiveStudents} />
        </>
      ),
    },
  ];

  const tournamentTabs = [
    {
      value: "active",
      label: "Active Tournaments",
      content: (
        <>
          <br />
          <TournamentList tournaments={activeTournaments} />
        </>
      ),
    },
    {
      value: "inactive",
      label: "Inactive Tournaments",
      content: (
        <>
          <br />
          <TournamentList tournaments={inactiveTournaments} />
        </>
      ),
    },
  ];

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
          <TabbedView tabs={teamTabs} defaultTab="active" />
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
          <TabbedView tabs={studentTabs} defaultTab="active" />
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
          <TabbedView tabs={tournamentTabs} defaultTab="active" />
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
