// Dependency imports
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

// Component imports
import SingleSchoolView from "../views/SingleSchoolView";
import SingleTeamView from "../views/SingleTeamView";
import SingleStudentView from "../views/SingleStudentView";
import SingleTournamentView from "../views/SingleTournamentView";
import SingleRoundView from "../views/SingleRoundView";
import NotFound from "../../../common/components/NotFound";
import Loading from "../../../common/components/Loading";

// utils imports
import { ROLES } from "../../../utils/constants";

// Hooks imports
import {
  useSchoolTeams,
  useSchoolStudents,
  useSchoolTournaments,
  useSchoolUsers,
  useSchoolRounds,
} from "../../../hooks/api/useSchoolData";
import { useSelectedItem } from "../../../common/hooks/useSelectedItem";

export default function SingleSchoolRouter({ selectedSchool }) {
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get("teamId");
  const studentId = searchParams.get("studentId");
  const tournamentId = searchParams.get("tournamentId");
  const roundId = searchParams.get("roundId");

  const { data: allSchoolTeams = [], isPending: isPendingTeams } =
    useSchoolTeams(selectedSchool.school_id);
  const { data: allSchoolStudents = [], isPending: isPendingStudents } =
    useSchoolStudents(selectedSchool.school_id);
  const { data: allSchoolTournaments = [], isPending: isPendingTournaments } =
    useSchoolTournaments(selectedSchool.school_id);
  const { data: allSchoolUsers = [], isPending: isPendingUsers } =
    useSchoolUsers(
      selectedSchool.school_id,
      selectedSchool.role === ROLES.PRIMARY
    );
  const { data: allSchoolRounds = [], isPending: isPendingRounds } =
    useSchoolRounds(selectedSchool.school_id);

  const selectedTeam = useSelectedItem({
    items: allSchoolTeams,
    id: teamId,
  });
  const selectedStudent = useSelectedItem({
    items: allSchoolStudents,
    id: studentId,
  });
  const selectedTournament = useSelectedItem({
    items: allSchoolTournaments,
    id: tournamentId,
  });
  const selectedRound = useSelectedItem({
    items: allSchoolRounds,
    id: roundId,
  });

  const [currentSchoolTab, setCurrentSchoolTab] = useState("teams");

  if (
    isPendingTeams ||
    isPendingStudents ||
    isPendingTournaments ||
    (isPendingUsers && selectedSchool.role === ROLES.PRIMARY) ||
    isPendingRounds
  ) {
    return <Loading />;
  }

  if (!teamId && !studentId && !tournamentId && !roundId)
    return (
      <SingleSchoolView
        selectedSchool={selectedSchool}
        allSchoolTeams={allSchoolTeams}
        allSchoolStudents={allSchoolStudents}
        allSchoolTournaments={allSchoolTournaments}
        allSchoolUsers={allSchoolUsers}
        currentTab={currentSchoolTab}
        setCurrentTab={setCurrentSchoolTab}
      />
    );
  if (teamId && !selectedTeam) return <NotFound type="team" />;
  if (studentId && !selectedStudent) return <NotFound type="student" />;
  if (tournamentId && !selectedTournament)
    return <NotFound type="tournament" />;
  if (roundId && !selectedRound) return <NotFound type="round" />;

  if (selectedTeam) {
    return (
      <SingleTeamView
        selectedTeam={selectedTeam}
        schoolRole={selectedSchool.role}
        schoolName={selectedSchool.schools.name}
      />
    );
  } else if (selectedStudent) {
    return (
      <SingleStudentView
        selectedStudent={selectedStudent}
        schoolRole={selectedSchool.role}
        schoolName={selectedSchool.schools.name}
      />
    );
  } else if (selectedTournament) {
    return (
      <SingleTournamentView
        selectedTournament={selectedTournament}
        schoolRole={selectedSchool.role}
        schoolName={selectedSchool.schools.name}
      />
    );
  } else if (selectedRound) {
    return (
      <SingleRoundView
        selectedRound={selectedRound}
        schoolRole={selectedSchool.role}
        schoolName={selectedSchool.schools.name}
      />
    );
  }
}
