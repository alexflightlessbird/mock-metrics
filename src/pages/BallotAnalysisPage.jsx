import {
  Button,
  Checkbox,
  Group,
  Space,
  Stack,
  Text,
  Tooltip,
  Card as MantineCard,
  Grid,
  Flex,
  Badge,
} from "@mantine/core";
import BasePage from "../common/components/BasePage";
import { useGetTournaments } from "../features/ballotAnalysis/hooks/useGetTournaments";
import { useLocalStorage } from "@mantine/hooks";
import Card from "../common/components/card/Card";
import { combineBallotsCalculations } from "../features/ballotAnalysis/utils/calculations";
import { useState } from "react";
import PageSection from "../common/components/PageSection";
import RoleTable from "../features/ballotAnalysis/components/RoleTable";

export default function BallotAnalysisPage() {
  const [selectedSchoolId] = useLocalStorage({
    key: "school",
    defaultValue: null,
  });

  const [selectedTournamentIds, setSelectedTournamentIds] = useState([]);
  const [selectedTeamIds, setSelectedTeamIds] = useState({});
  const [neededTournamentData, setNeededTournamentData] = useState([]);

  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisRunning, setAnalysisRunning] = useState(false);

  const { data: tournaments, isLoading } = useGetTournaments(selectedSchoolId);

  const maxTournaments = 10;

  const handleTournamentChange = (tournamentIds) => {
    // Limit selection to maxTournaments
    const limitedSelection = tournamentIds.slice(0, maxTournaments);
    setSelectedTournamentIds(limitedSelection);

    setSelectedTeamIds((prev) => {
      const newSelectedTeams = { ...prev };
      limitedSelection.forEach((tId) => {
        if (!newSelectedTeams[tId]) {
          newSelectedTeams[tId] = [];
        }
      });
      Object.keys(newSelectedTeams).forEach((tId) => {
        if (!limitedSelection.includes(tId)) {
          delete newSelectedTeams[tId];
        }
      });
      return newSelectedTeams;
    });
  };

  const isTournamentDisabled = (tournamentId) => {
    return (
      !selectedTournamentIds.includes(tournamentId) &&
      selectedTournamentIds.length >= maxTournaments
    );
  };

  if (isLoading)
    return (
      <BasePage titleText="Loading...">
        <Text>Loading tournaments...</Text>
      </BasePage>
    );

  const handleSubmit = async () => {
    setAnalysisRunning(true);
    const selectedTournaments = tournaments.filter((t) =>
      selectedTournamentIds.includes(t.id)
    );

    const currentTournamentData = selectedTournaments.map((t) => ({
      area: t.area,
      case_id: t.case_id,
      id: t.id,
      name: t.name,
      type: t.type,
      year: t.year,
      teams: t.teams_tournaments
        .filter((tt) => selectedTeamIds[t.id]?.includes(tt.team_id))
        .map((tt) => ({
          id: tt.team_id,
          name: tt.teams.name,
          type: tt.teams.type,
          year: tt.teams.year,
          rounds: t.rounds
            .filter((r) => r.team_id === tt.team_id)
            .sort((a, b) => a.round_number - b.round_number)
            .map((r) => ({
              id: r.id,
              round_number: r.round_number,
              side: r.side,
              witness_rounds: r.witness_rounds.map((wr) => ({
                role_type: wr.role_type,
                witness: {
                  id: wr.witnesses.id,
                  name: wr.witnesses.name,
                  side: wr.witnesses.side,
                  type: wr.witnesses.type,
                },
              })),
              role_rounds: r.role_rounds.map((rr) => ({
                role_type: rr.role_type,
                student: {
                  id: rr.students.id,
                  name: rr.students.name,
                },
              })),
              calculations: combineBallotsCalculations({
                side: r.side,
                ballots: r.ballots,
                role_rounds: r.role_rounds,
              }),
              ballots: r.ballots.length,
            })),
        })),
    }));

    console.log(currentTournamentData);
    setNeededTournamentData(currentTournamentData);

    setTimeout(() => {
      setAnalysisRunning(false);
      setShowAnalysis(true);
    }, 3000);
  };

  return (
    <BasePage titleText="Ballot Analysis">
      <Stack spacing="sm" mb="md">
        <Text size="sm" c="dimmed">
          Select up to {maxTournaments} tournaments (
          {selectedTournamentIds.length}/{maxTournaments} selected)
        </Text>

        <Checkbox.Group
          value={selectedTournamentIds}
          onChange={handleTournamentChange}
        >
          <Group direction="row" gap="lg" align="start">
            {tournaments?.map((t) => {
              const disabled = isTournamentDisabled(t.id) || analysisRunning;

              return (
                <Tooltip
                  key={t.id}
                  label={
                    disabled
                      ? analysisRunning
                        ? "Analysis is currently running. Please wait."
                        : `Maximum ${maxTournaments} tournaments selected. Deselect some to select more.`
                      : ""
                  }
                  disabled={!disabled}
                  position="top"
                >
                  <div style={{ cursor: disabled ? "not-allowed" : "default" }}>
                    <Card
                      style={{
                        opacity: disabled ? 0.6 : 1,
                        pointerEvents: disabled ? "none" : "auto",
                        cursor: disabled ? "not-allowed" : "pointer",
                      }}
                      onClick={() => {
                        if (!disabled) {
                          if (selectedTournamentIds.includes(t.id)) {
                            handleTournamentChange(
                              selectedTournamentIds.filter((id) => id !== t.id)
                            );
                          } else {
                            handleTournamentChange([
                              ...selectedTournamentIds,
                              t.id,
                            ]);
                          }
                        }
                      }}
                    >
                      <Stack spacing="xs">
                        <Checkbox
                          value={t.id}
                          label={t.name}
                          disabled={disabled}
                        />
                        {selectedTournamentIds.includes(t.id) && (
                          <Checkbox.Group
                            pl="lg"
                            onChange={(teamIds) => {
                              setSelectedTeamIds((prev) => ({
                                ...prev,
                                [t.id]: teamIds,
                              }));
                            }}
                          >
                            <Stack gap="xs">
                              {t.teams_tournaments.map((tt) => (
                                <Checkbox
                                  key={tt.team_id}
                                  value={tt.team_id}
                                  label={tt.teams.name}
                                  disabled={analysisRunning}
                                />
                              ))}
                            </Stack>
                          </Checkbox.Group>
                        )}
                      </Stack>
                    </Card>
                  </div>
                </Tooltip>
              );
            })}
          </Group>
        </Checkbox.Group>
      </Stack>
      <Tooltip
        label={
          selectedTournamentIds.length === 0
            ? "Select at least one tournament"
            : Object.values(selectedTeamIds).some((ids) => ids.length === 0)
            ? "Select at least one team for each selected tournament"
            : analysisRunning
            ? "Analysis is currently running. Please wait."
            : showAnalysis
            ? "Analysis already run. Refresh to run again."
            : ""
        }
        disabled={
          selectedTournamentIds.length > 0 &&
          !Object.values(selectedTeamIds).some((ids) => ids.length === 0) &&
          (analysisRunning || !showAnalysis)
        }
        position="top"
      >
        <Button
          disabled={
            selectedTournamentIds.length === 0 ||
            Object.values(selectedTeamIds).some((ids) => ids.length === 0) ||
            (!analysisRunning && showAnalysis)
          }
          onClick={() => {
            handleSubmit();
          }}
          mb="md"
          loading={analysisRunning}
        >
          Run Analysis
        </Button>
      </Tooltip>

      {showAnalysis && (
        <PageSection title="analysis results">
          <Button
            onClick={() => {
              setShowAnalysis(false);
              setAnalysisRunning(false);
              setSelectedTournamentIds([]);
              setSelectedTeamIds({});
            }}
          >
            Refresh
          </Button>

          <Space h="md" />

          {neededTournamentData.map((t) => (
            <div key={t.id}>
              <Text size="lg" weight={600} mb="sm" tt="capitalize">
                {t.name} ({t.year})
              </Text>
              {t.teams.map((team) => (
                <div key={team.id}>
                  <Text size="md" weight={500} mb="xs">
                    {team.name} ({team.year})
                  </Text>
                  <Text size="sm" c="dimmed" mb="sm">
                    Rounds Analyzed: {team.rounds.length} (
                    {team.rounds.reduce((sum, r) => sum + r.ballots, 0)}{" "}
                    ballots)
                  </Text>
                  <Grid>
                    {team.rounds.map((round) => {
                      return (
                        <Grid.Col key={round.id} span={{ base: 12, lg: 6 }}>
                          <Card>
                            <MantineCard.Section
                              withBorder
                              inheritPadding
                              py="sm"
                            >
                              <Flex justify="space-between" align="center">
                                <Text fw={500}>
                                  Round {round.round_number} -{" "}
                                  {round.side.toUpperCase()}
                                </Text>
                                <Group gap="xs">
                                  <Text size="sm" c="dimmed">
                                    Ballots:
                                  </Text>
                                  <Badge
                                    fz="sm"
                                    color={
                                      round.ballots == 0
                                        ? "yellow"
                                        : round.ballots > 1
                                        ? "blue"
                                        : "red"
                                    }
                                  >
                                    {round.ballots}
                                  </Badge>
                                </Group>
                              </Flex>
                            </MantineCard.Section>

                            <MantineCard.Section inheritPadding py="sm">
                              <RoleTable
                                role_rounds={round.role_rounds}
                                witness_rounds={round.witness_rounds}
                                side={round.side}
                              />
                            </MantineCard.Section>
                          </Card>
                        </Grid.Col>
                      );
                    })}
                  </Grid>
                </div>
              ))}
            </div>
          ))}
        </PageSection>
      )}
    </BasePage>
  );
}
