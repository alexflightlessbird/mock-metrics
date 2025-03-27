import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import SchoolBreadcrumb from "./SchoolBreadcrumb";
import SingleTeam from "./SingleTeam";
import SingleStudent from "./SingleStudent";
import SingleTournament from "./SingleTournament";
import SingleSchoolDetails from "./SingleSchoolDetails";
import { ROLES } from "../../utils/constants";
import { useSchoolTeams, useSchoolTournaments, useSchoolStudents, useSchoolUsers, useSchoolStudentTeams } from "../../hooks/api/useSchoolData";

export default function SingleSchool({ selectedSchool }) {
  const [searchParams] = useSearchParams();
  const schoolId = selectedSchool.schools.id;
  const teamId = searchParams.get("teamId");
  const studentId = searchParams.get("studentId");
  const tournamentId = searchParams.get("tournamentId");

  const [currentTab, setCurrentTab] = useState("teams");

  const { data: allTeams = [], isPending: isTeamsPending } = useSchoolTeams(schoolId);
  const { data: allStudents = [], isPending: isStudentsPending } = useSchoolStudents(schoolId);
  const { data: allStudentTeams = [], isPending: isStudentTeamsPending } = useSchoolStudentTeams(schoolId);
  const { data: allTournaments = [], isPending: isTournamentsPending } = useSchoolTournaments(schoolId);
  const { data: allUsers = [], isPending: isUsersPending } = useSchoolUsers(schoolId, !!schoolId && selectedSchool.role === ROLES.PRIMARY);

  const renderContent = () => {
    if (teamId) {
      if (isTeamsPending || isStudentTeamsPending) return <div>Team loading...</div>;
      const team = allTeams.find((t) => t.id === parseInt(teamId));
      if (!team) return <SingleTeam />;
      return <SingleTeam selectedSchool={selectedSchool} selectedTeam={team} />;
    }

    if (studentId) {
      if (isStudentsPending || isStudentTeamsPending) return <div>Student loading...</div>
      const student = allStudents.find((s) => s.id === parseInt(studentId));
      if (!student) return <SingleStudent />;
      return <SingleStudent selectedSchool={selectedSchool} selectedStudent={student} allTeams={allTeams} allStudentTeams={allStudentTeams} />;
    }

    if (tournamentId) {
      if (isTournamentsPending) return <div>Tournament loading...</div>
      const tournament = allTournaments.find((t) => t.id === parseInt(tournamentId));
      if (!tournament) return <SingleTournament />;
      return <SingleTournament selectedSchool={selectedSchool} selectedTournament={tournament} allTeams={allTeams} allStudentTeams={allStudentTeams} />;
    }

    return (
      <SingleSchoolDetails
        selectedSchool={selectedSchool}
        allUsers={allUsers}
        allStudents={allStudents}
        allTeams={allTeams}
        allTournaments={allTournaments}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        pending={{ teams: isTeamsPending, students: isStudentsPending, tournaments: isTournamentsPending, users: isUsersPending}}
      />
    )
  }

  return (
    <>
      <SchoolBreadcrumb
        selectedSchool={selectedSchool}
        allStudents={allStudents}
        allTeams={allTeams}
        allTournaments={allTournaments}
      />
      {renderContent()}
    </>
  )
}