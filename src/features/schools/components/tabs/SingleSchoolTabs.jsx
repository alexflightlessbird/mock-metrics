import { useActiveFilters } from "../../../../common/hooks/useActiveFilters";
import { useRoleFilters } from "../../hooks/useRoleFilters";
import TabbedView from "../../../../common/components/TabbedView";
import UserList from "../lists/SingleSchool/UserList";
import TeamList from "../lists/SingleSchool/TeamList";
import StudentList from "../lists/SingleSchool/StudentList";
import TournamentList from "../lists/SingleSchool/TournamentList";
import { Text, Tooltip } from "@mantine/core";
import { PREMIUM_LIMITS, ROLES } from "../../../../utils/constants";

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

  tabs.push(
    {
      value: "teams",
      label: "Teams",
      content: (
        <>
          <br />
          <Text>This will be a row of buttons for admins to make changes.</Text>
          <br />
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
          <Text>This will be a row of buttons for admins to make changes.</Text>
          <br />
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
          <Text>This will be a row of buttons for admins to make changes.</Text>
          <br />
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
