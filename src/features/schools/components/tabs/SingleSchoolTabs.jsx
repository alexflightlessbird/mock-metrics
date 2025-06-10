import { useMemo } from "react";
import { useRoleFilters } from "../../hooks/useRoleFilters";
import { ROLES } from "../../../../utils/constants";
import TabbedView from "../../../../common/components/TabbedView";
import UsersTabContent from "./UsersTabContent";
import TeamsTabContent from "./TeamsTabContent";
import StudentsTabContent from "./StudentsTabContent";
import TournamentsTabContent from "./TournamentsTabContent";
import { useAddTeamForm, useAddStudentForm, useAddTournamentForm } from "../../hooks/useSingleSchoolTabs";

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
  setCurrentTab
}) {
  const { primary: primaryAdminUsers, admin: adminUsers, viewer: viewerUsers } = useRoleFilters(allUsers);

  const addTeamForm = useAddTeamForm(schoolId);
  const addStudentForm = useAddStudentForm(schoolId);
  const addTournamentForm = useAddTournamentForm(schoolId);

  const hasAddPermissions = [ROLES.PRIMARY, ROLES.ADMIN].includes(role);

  const tabs = useMemo(() => {
    const tabItems = [];
    
    if (role === ROLES.PRIMARY) {
      tabItems.push({
        value: "users",
        label: "School Users",
        content: (
          <UsersTabContent
            isPremium={isPremium}
            schoolId={schoolId}
            schoolName={schoolName}
            primaryAdminUsers={primaryAdminUsers}
            adminUsers={adminUsers}
            viewerUsers={viewerUsers}
          />
        )
      })
    }

    tabItems.push(
      {
        value: "teams",
        label: "Teams",
        content: (
          <TeamsTabContent
            allTeams={allTeams}
            hasAddPermissions={hasAddPermissions}
            addTeamForm={addTeamForm}
          />
        )
      },
      {
        value: "students",
        label: "Students",
        content: (
          <StudentsTabContent
            allStudents={allStudents}
            hasAddPermissions={hasAddPermissions}
            addStudentForm={addStudentForm}
          />
        )
      },
      {
        value: "tournaments",
        label: "Tournaments",
        content: (
          <TournamentsTabContent
            allTournaments={allTournaments}
            hasAddPermissions={hasAddPermissions}
            addTournamentForm={addTournamentForm}
          />
        )
      }
    )

    return tabItems;
  }, [role, isPremium, schoolId, schoolName, primaryAdminUsers, adminUsers, viewerUsers, allTeams, allStudents, allTournaments, hasAddPermissions, addTeamForm, addStudentForm, addTournamentForm]);

  return (
    <TabbedView
      tabs={tabs}
      defaultTab={currentTab}
      onTabChange={setCurrentTab}
    />
  )
}