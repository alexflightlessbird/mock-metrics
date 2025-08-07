import {
  Badge,
  Card as MantineCard,
  Flex,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import { useTournamentTeamRounds } from "../../../common/hooks/useTournamentDetails";
import { useState } from "react";
import RoundTable from "./RoundTable";
import { useRoundBallots } from "../hooks/useRoundBallots";
import Card from "../../../common/components/card/Card";
import AddRoundModal from "./AddRoundModal";
import AddButton from "../../../common/components/AddButton";
import { useGetRole } from "../../../common/hooks/useGetRole";
import { useAuth } from "../../../context/AuthContext";

export default function TeamCard({
  team,
  caseType,
  nationalsTournament = false,
  tournamentStatus = true,
}) {
  const [showRounds, setShowRounds] = useState(false);
  const [addRoundModalOpened, setAddRoundModalOpened] = useState(false);
  const { data: rounds, isLoading: roundsLoading } = useTournamentTeamRounds(
    team.tournament_id,
    team.team_id
  );
  const {
    data: roundResults,
    isLoading: resultsLoading,
    refreshBallots,
  } = useRoundBallots(rounds || []);
  const { user } = useAuth();

  const { role, isLoading: roleLoading } = useGetRole(
    user.id,
    team.teams.school_id
  );

  if (roundsLoading || resultsLoading || roleLoading)
    return (
      <MantineCard withBorder shadow="md" radius="md">
        <Skeleton h={30} />
      </MantineCard>
    );

  const sortedResults = [...(roundResults || [])].sort(
    (a, b) => a.round_number - b.round_number
  );

  const calculateRecord = () => {
    let wins = 0;
    let losses = 0;
    let ties = 0;

    sortedResults.forEach((r) => {
      if (r.result && r.result !== "Loading...") {
        const [winStr, lossStr, tieStr] = r.result.split("-");
        wins += parseInt(winStr) || 0;
        losses += parseInt(lossStr) || 0;
        ties += parseInt(tieStr) || 0;
      }
    });

    return { wins, losses, ties };
  };

  const record = calculateRecord();
  const recordVal = record.wins + record.ties * 0.5;
  const totalRecordVal = record.wins + record.losses + record.ties;

  const existingRoundNumbers = rounds.map((round) => round.round_number);

  return (
    <>
      <Card>
        <MantineCard.Section withBorder inheritPadding py="sm">
          <Flex justify="space-between" align="center">
            <Text fw={500}>{team.teams.name}</Text>
            <Badge
              fz="sm"
              color={
                recordVal > totalRecordVal - recordVal
                  ? "blue"
                  : recordVal == totalRecordVal - recordVal
                  ? "gray"
                  : "pink"
              }
            >
              {record.wins}-{record.losses}-{record.ties}
            </Badge>
          </Flex>
        </MantineCard.Section>

        <MantineCard.Section inheritPadding py="sm">
          <Stack gap="xs">
            <Text
              span
              style={{
                cursor: "pointer",
                userSelect: "none",
                WebkitUserSelect: "none",
              }}
              c="blue"
              onClick={() => {
                setShowRounds(!showRounds);
              }}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setShowRounds(!showRounds);
                }
              }}
            >
              {showRounds ? "Hide Rounds" : "Show Rounds"}
            </Text>
            {showRounds &&
              rounds.length < (nationalsTournament ? 5 : 4) &&
              (role === "admin" || role === "primary") &&
              tournamentStatus && (
                <AddRoundModal
                  existingRounds={existingRoundNumbers}
                  nationalsTournament={nationalsTournament}
                  caseType={caseType}
                  tournamentId={team.tournament_id}
                  teamId={team.team_id}
                  caseId={team.tournaments.case_id}
                  trigger={
                    <AddButton onClick={() => setAddRoundModalOpened(true)}>
                      Add Round
                    </AddButton>
                  }
                />
              )}
            {showRounds && sortedResults.length > 0 && (
              <>
                <Text fw={500} size="sm">
                  Rounds:
                </Text>
                <RoundTable
                  data={sortedResults}
                  caseType={caseType}
                  role={role}
                  refreshBallots={refreshBallots}
                  tournamentStatus={tournamentStatus}
                />
              </>
            )}
            {showRounds && sortedResults.length == 0 && (
              <Text c="dimmed">No rounds associated with this team.</Text>
            )}
          </Stack>
        </MantineCard.Section>
      </Card>
    </>
  );
}
