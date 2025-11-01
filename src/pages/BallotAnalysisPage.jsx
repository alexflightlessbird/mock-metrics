import {
  Button,
  Checkbox,
  Group,
  Space,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import BasePage from "../common/components/BasePage";
import { useMemo, useState } from "react";
import { useGetTournaments } from "../features/ballotAnalysis/hooks/useGetTournaments";
import { useLocalStorage } from "@mantine/hooks";
import ballotAverage from "../features/ballotAnalysis/utils/ballotAverage";
import Card from "../common/components/card/Card";

export default function BallotAnalysisPage() {
  const [selectedSchoolId] = useLocalStorage({
    key: "school",
    defaultValue: null,
  });

  const [selectedTournamentIds, setSelectedTournamentIds] = useState([]);
  const [selectedTeamIds, setSelectedTeamIds] = useState({});

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

  /*useMemo(() => {
    if (!tournaments) return;
    console.log(
      tournaments.map((t) => ({
        name: t.name,
        teams: t.teams_tournaments.map((tt) => ({
          name: tt.teams.name,
          rounds: t.rounds
            .filter((r) => r.teams.id === tt.team_id)
            .map((r) => ({
              number: r.round_number,
              side: r.side,
              ballots: r.ballots.map((b) => ({
                judge: b.judge_name,
                average: ballotAverage(b.scores).overallAverage,
              })),
              witnesses: r.witness_rounds,
              students: r.role_rounds,
            })),
        })),
      }))
    );
  }, [tournaments]);*/

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

    const neededTournamentData = selectedTournaments.map((t) => ({
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
              ballots: r.ballots.map((b) => ({
                id: b.id,
                judge_name: b.judge_name,
                average: ballotAverage(b.scores).overallAverage,
                scores: b.scores.map((s) => ({
                  id: s.id,
                  score_type: s.score_type,
                  score_value: s.score_value,
                })),
              })),
            })),
        })),
    }));

    console.log(neededTournamentData);
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
            : ""
        }
        disabled={
          selectedTournamentIds.length > 0 &&
          !Object.values(selectedTeamIds).some((ids) => ids.length === 0)
        }
        position="top"
      >
        <Button
          disabled={
            selectedTournamentIds.length === 0 ||
            Object.values(selectedTeamIds).some((ids) => ids.length === 0)
          }
          onClick={() => {
            setShowAnalysis(true);
            handleSubmit();
          }}
          mb="md"
        >
          Run Analysis
        </Button>
      </Tooltip>

      {showAnalysis && (
        <>
          <Text>
            Tournament:{" "}
            {tournaments.find((t) => t.id === selectedTournamentIds[0])?.name}
          </Text>
          <Text>
            {selectedTeamIds[selectedTournamentIds[0]].map((id) => id)}
          </Text>
        </>
      )}
    </BasePage>
  );
}
