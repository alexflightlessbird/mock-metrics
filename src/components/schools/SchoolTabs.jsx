import { useMemo } from "react";
import { Tabs, Tooltip, Text } from "@mantine/core";
import { PREMIUM_LIMITS, ROLES } from "../../utils/constants";
import UserList from "./UserList";
import TeamList from "./TeamList";
import StudentList from "./StudentList";
import TournamentList from "./TournamentList";

export default function SchoolTabs({
  role,
  allUsers,
  allTeams,
  allStudents,
  allTournaments,
  isPremium,
  schoolId,
  schoolName,
  currentTab,
  setCurrentTab,
}) {
  const [activeTeams, inactiveTeams] = useMemo(() => {
    const active = allTeams.filter((t) => t.is_active);
    const inactive = allTeams.filter((t) => !t.is_active);
    return [active, inactive];
  }, [allTeams]);

  const [activeStudents, inactiveStudents] = useMemo(() => {
    const active = allStudents.filter((s) => s.is_active);
    const inactive = allStudents.filter((s) => !s.is_active);
    return [active, inactive];
  }, [allStudents]);

  const [activeTournaments, inactiveTournaments] = useMemo(() => {
    const active = allTournaments.filter((t) => t.is_active);
    const inactive = allTournaments.filter((t) => !t.is_active);
    return [active, inactive];
  }, [allTournaments]);

  const [primaryAdminUsers, adminUsers, viewerUsers] = useMemo(() => {
    const primary = allUsers.filter((u) => u.role === ROLES.PRIMARY);
    const admin = allUsers.filter((u) => u.role === ROLES.ADMIN);
    const viewer = allUsers.filter((u) => u.role === ROLES.VIEWER);
    return [primary, admin, viewer];
  }, [allUsers]);

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

  return (
    <Tabs defaultValue={currentTab} onChange={setCurrentTab}>
      <Tabs.List>
        {role === ROLES.PRIMARY && (
          <Tabs.Tab value="users">School Users</Tabs.Tab>
        )}
        <Tabs.Tab value="teams">Teams</Tabs.Tab>
        <Tabs.Tab value="students">Students</Tabs.Tab>
        <Tabs.Tab value="tournaments">Tournaments</Tabs.Tab>
      </Tabs.List>

      {role === ROLES.PRIMARY && (
        <Tabs.Panel value="users">
          <>
            <br />
            <Text>To add additional users, please contact MSU Mock Trial.</Text>
            <h3>
              Primary Admins{" "}
              {isPremium ? (
                ""
              ) : (
                <Tooltip {...tooltipProps}>
                  <span>
                    ({primaryAdminUsers.length}/{PREMIUM_LIMITS.PRIMARY})
                  </span>
                </Tooltip>
              )}
            </h3>
            <UserList users={primaryAdminUsers} {...userListProps} />
            <h3>
              Admins{" "}
              {isPremium ? (
                ""
              ) : (
                <Tooltip {...tooltipProps}>
                  <span>
                    ({adminUsers.length}/{PREMIUM_LIMITS.ADMIN})
                  </span>
                </Tooltip>
              )}
            </h3>
            <UserList users={adminUsers} {...userListProps} />
            <h3>
              Viewers{" "}
              {isPremium ? (
                ""
              ) : (
                <Tooltip {...tooltipProps}>
                  <span>
                    ({viewerUsers.length}/{PREMIUM_LIMITS.VIEWER})
                  </span>
                </Tooltip>
              )}
            </h3>
            <UserList users={viewerUsers} {...userListProps} />
          </>
        </Tabs.Panel>
      )}

      <Tabs.Panel value="teams">
        <>
          <h3>Active Teams</h3>
          <TeamList teams={activeTeams} />
          <h3>Inactive Teams</h3>
          <TeamList teams={inactiveTeams} />
        </>
      </Tabs.Panel>

      <Tabs.Panel value="students">
        <>
          <h3>Active Students</h3>
          <StudentList students={activeStudents} />
          <h3>Inactive Students</h3>
          <StudentList students={inactiveStudents} />
        </>
      </Tabs.Panel>

      <Tabs.Panel value="tournaments">
        <>
          <h3>Active Tournaments</h3>
          <TournamentList tournaments={activeTournaments} />
          <h3>Inactive Tournaments</h3>
          <TournamentList tournaments={inactiveTournaments} />
        </>
      </Tabs.Panel>
    </Tabs>
  );
}
