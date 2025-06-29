// Component imports
import List from "../../../../../common/components/List";
import Loading from "../../../../../common/components/Loading";
import TeamItem from "./supports/TeamItem";

// Hooks imports
import { useTournamentRounds } from "../../../../../hooks/api/useSchoolData";

export default function TournamentTeamList({
  teams,
  schoolRole,
  tournamentId,
  pSide
}) {
  const { data: allTournamentRounds, isRoundsLoading } = useTournamentRounds(tournamentId);

  function filterRounds(teamId) {
    const data = allTournamentRounds?.filter((r) => r.team_id === teamId);
    return {
      data,
      number: data?.length || 0
    }
  }

  if (isRoundsLoading || !allTournamentRounds) return <Loading />;

  const mappedTeams = teams.map((t) => {
    const teamRounds = filterRounds(t.team_id);
    return (
      <TeamItem
        team={t}
        schoolRole={schoolRole}
        tournamentId={tournamentId}
        pSide={pSide}
        teamRounds={teamRounds}
      />
    )
  });

  if (mappedTeams.length === 0) mappedTeams.push("None");

  return <List items={mappedTeams} />
}