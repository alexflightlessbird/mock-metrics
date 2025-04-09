// Dependency imports
import { Link } from "react-router-dom";
import { Flex, Text, Select } from "@mantine/core";
import { modals } from "@mantine/modals";

// Component imports
import List from "../../../../../common/components/List";
import { DeleteIcon } from "../../../../../common/components/ActionIcons";

// Utils imports
import { ROLES } from "../../../../../utils/constants";

// Hooks imports
import {
  useTournamentRounds,
  useSchoolDataMutations,
} from "../../../../../hooks/api/useSchoolData";

export default function TourmamentTeamList({
  teams,
  schoolRole,
  schoolId,
  tournamentId,
}) {
  const { removeTeamFromTournament } = useSchoolDataMutations();

  let { data: allTournamentRounds } = useTournamentRounds(tournamentId);

  function removeTeamModal(team) {
    modals.openConfirmModal({
      title: `Remove Team: ${team.teams.name}`,
      centered: true,
      children: (
        <Text>
          Are you sure you want to remove {team.teams.name} from{" "}
          {team.tournaments.name}?<br />
          <br />
          Removing the team will remove all data (including ballots) associated
          between this team and this tournament. This action is not reversible
          and data cannot be recovered.
        </Text>
      ),
      labels: { confirm: "Remove", cancel: "Cancel" },
      onConfirm: async () => {
        try {
          await removeTeamFromTournament({
            teamId: team.team_id,
            tournamentId: team.tournament_id,
            schoolId: team.teams.school_id,
          });
          modals.closeAll();
        } catch (error) {
          console.error("Team removal failed:", error);
        }
      },
    });
  }

  function filterRounds(teamId) {
    const data = allTournamentRounds?.filter((r) => r.team_id === teamId);
    return {
      data,
      number: data?.length || 0,
      round1: data?.find((r) => r.round_number === 1) || false,
      round2: data?.find((r) => r.round_number === 2) || false,
      round3: data?.find((r) => r.round_number === 3) || false,
      round4: data?.find((r) => r.round_number === 4) || false,
    };
  }

  const mappedTeams = [];
  teams.map((t) => {
    const teamRounds = filterRounds(t.team_id);
    const mappedRounds = [];

    teamRounds.data?.map((r) => {
      mappedRounds.push(
        <Link to={`/schools?schoolId=${t.teams.school_id}&roundId=${r.id}`}>
          Round {r.round_number}
        </Link>
      );
    });

    if (mappedRounds.length == 0) mappedRounds.push("No rounds assigned");

    mappedTeams.push(
      <>
        <Flex style={{ alignItems: "center", gap: "7px" }} key={t.team_id}>
          <Link
            to={`/schools?schoolId=${t.teams.school_id}&teamId=${t.team_id}`}
          >
            {t.teams.name}
          </Link>
          {[ROLES.PRIMARY, ROLES.ADMIN].includes(schoolRole) && (
            <DeleteIcon onClick={() => removeTeamModal(t)} />
          )}
        </Flex>
        <List items={mappedRounds} withPadding={false} />
      </>
    );
  });
  if (mappedTeams.length == 0) mappedTeams.push("None");
  return <List items={mappedTeams} />;
}
