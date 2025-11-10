import {
  Checkbox,
  Group,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import BasePage from "../common/components/BasePage";
import { useGetTournaments } from "../features/ballotAnalysis/hooks/useGetTournaments";
import { useLocalStorage } from "@mantine/hooks";
import Card from "../common/components/card/Card";
import { useEffect, useState } from "react";
import { LuFilter } from "react-icons/lu";
import RunAnalysisButton from "../features/ballotAnalysis/components/RunAnalysisButton";
import useRunBallotAnalysis from "../features/ballotAnalysis/hooks/useRunBallotAnalysis";
import AnalysisResults from "../features/ballotAnalysis/components/AnalysisResults";
import Loader from "../common/components/loader/GavelLoader";

export default function BallotAnalysisPage() {
  const [selectedSchoolId] = useLocalStorage({
    key: "school",
    defaultValue: null,
  });
  const [selectedTournamentIds, setSelectedTournamentIds] = useState([]);
  const [selectedTeamIds, setSelectedTeamIds] = useState({});

  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showTournamentSelection, setShowTournamentSelection] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

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

  useEffect(() => {
    if (!neededTournamentData || neededTournamentData.length === 0) return;
    if (!calculatedTeamScores || calculatedTeamScores.length === 0) return;
    if (!allTeamScores || allTeamScores.length === 0) return;
    if (analysisRunning) return;

    setTimeout(() => {
      setShowTournamentSelection(false);
      setShowAnalysis(true);
      setButtonLoading(false);
    }, 1000);
  }, [neededTournamentData, calculatedTeamScores, allTeamScores, analysisRunning]);

  if (isLoading)
    return (
      <BasePage titleText="Loading...">
        <Loader scale={1.5} />
        <Text c="dimmed" ta="center" mt="sm" size="lg">This may take a moment.</Text>
      </BasePage>
    );

  const handleSubmit = async () => {
    setButtonLoading(true);
    await runAnalysis(selectedTournamentIds, selectedTeamIds);
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
                    isTournamentDisabled(t.id) || analysisRunning || buttonLoading;

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
            loading={buttonLoading}
            showAnalysis={showAnalysis}
            onRunAnalysis={handleSubmit}
          />
        </>
      )}

      {showAnalysis && (
        <AnalysisResults 
          handleRefresh={handleRefresh}
          neededTournamentData={neededTournamentData}
          calculatedTeamScores={calculatedTeamScores}
          allTeamScores={allTeamScores}
          attorneys={overallScores.attorneys}
          witnesses={overallScores.witnesses}
        />
      )}
    </BasePage>
  );
}
