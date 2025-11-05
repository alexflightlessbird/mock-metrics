import {
  Button,
  Checkbox,
  Group,
  Space,
  Stack,
  Text,
  Tooltip,
  Title,
} from "@mantine/core";
import BasePage from "../common/components/BasePage";
import { useGetTournaments } from "../features/ballotAnalysis/hooks/useGetTournaments";
import { useLocalStorage } from "@mantine/hooks";
import Card from "../common/components/card/Card";
import { useState } from "react";
import PageSection from "../common/components/PageSection";
import TeamCard from "../features/ballotAnalysis/components/TeamCard";
import TournamentSummaryCard from "../features/ballotAnalysis/components/TournamentSummaryCard";
import AttorneyTable from "../features/ballotAnalysis/components/AttorneyTable";
import WitnessTable from "../features/ballotAnalysis/components/WitnessTable";
import { LuFilter } from "react-icons/lu";
import RunAnalysisButton from "../features/ballotAnalysis/components/RunAnalysisButton";
import useRunBallotAnalysis from "../features/ballotAnalysis/hooks/useRunBallotAnalysis";
import RefreshAnalysisButton from "../features/ballotAnalysis/components/RefreshAnalysisButton";

export default function BallotAnalysisPage() {
  const [selectedSchoolId] = useLocalStorage({
    key: "school",
    defaultValue: null,
  });
  const [selectedTournamentIds, setSelectedTournamentIds] = useState([]);
  const [selectedTeamIds, setSelectedTeamIds] = useState({});

  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showTournamentSelection, setShowTournamentSelection] = useState(true);

  const { data: tournaments, isLoading } = useGetTournaments(selectedSchoolId);
  const { 
    runAnalysis, 
    analysisRunning, 
    neededTournamentData, 
    calculatedTeamScores,
    allTeamScores,
    overallScores
  } = useRunBallotAnalysis();

  const maxTournaments = 10;

  const handleTournamentChange = (tournamentIds) => {
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
    await runAnalysis(tournaments, selectedTournamentIds, selectedTeamIds);

    setTimeout(() => {
      setShowAnalysis(true);
      setShowTournamentSelection(false);
    }, 3000);
  };

  const handleRefresh = () => {
    setShowAnalysis(false);
    setSelectedTournamentIds([]);
    setSelectedTeamIds({});
    setShowTournamentSelection(true);
  }

  return (
    <BasePage titleText="Ballot Analysis">
      {showTournamentSelection && (
        <>
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
                  const disabled =
                    isTournamentDisabled(t.id) || analysisRunning;

                  return (
                    <Tooltip
                      key={`${t.id}-tooltip`}
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
                      <div
                        style={{ cursor: disabled ? "not-allowed" : "default" }}
                      >
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
                                  selectedTournamentIds.filter(
                                    (id) => id !== t.id
                                  )
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
          <RunAnalysisButton
            selectedTournamentIds={selectedTournamentIds}
            selectedTeamIds={selectedTeamIds}
            analysisRunning={analysisRunning}
            showAnalysis={showAnalysis}
            onRunAnalysis={handleSubmit}
          />
        </>
      )}

      {showAnalysis && (
        <>
          <RefreshAnalysisButton onRefresh={handleRefresh} />

          <Space h="md" />

          <PageSection
            title="tournament summaries"
            collapsible={true}
            defaultOpen={true}
          >
            {neededTournamentData.map((t) => {
              const tournamentTeamScores = calculatedTeamScores.find(
                (ts) => ts.tournamentId === t.id
              );

              return (
                <Stack gap="md" key={t.id}>
                  <TournamentSummaryCard
                    tournament={t}
                    allTeamScores={allTeamScores.filter(
                      (ts) => ts.tournamentId === t.id
                    )}
                  >
                    {t.teams.map((team) => {
                      return (
                        <TeamCard
                          key={team.id}
                          team={team}
                          tournamentTeamScores={tournamentTeamScores}
                          tournamentName={t.name}
                        />
                      );
                    })}
                  </TournamentSummaryCard>
                </Stack>
              );
            })}
          </PageSection>

          <Space h="md" />
          <PageSection title="overall scores">
            <Title order={3} mb="sm">
              Attorneys
            </Title>
            {/* add filter to show team breakdowns - filter the overallScores.attorneys to be only from that particular team(s) */}
            <AttorneyTable
              showTeam={true}
              allScores={overallScores.attorneys}
            />

            <Space h="sm" />

            <Title order={3} mb="sm">
              Witnesses
            </Title>
            {/* same as attorney - need filter */}
            <WitnessTable showTeam={true} allScores={overallScores.witnesses} />
          </PageSection>
        </>
      )}
    </BasePage>
  );
}
