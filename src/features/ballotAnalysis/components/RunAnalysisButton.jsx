import { Button, Tooltip } from "@mantine/core";

export default function RunAnalysisButton({
  selectedTournamentIds,
  selectedTeamIds,
  analysisRunning,
  showAnalysis,
  onRunAnalysis,
}) {
  const isDisabled =
    selectedTournamentIds.length === 0 ||
    Object.values(selectedTeamIds).some((ids) => ids.length === 0) ||
    (!analysisRunning && showAnalysis);

  const tooltipLabel =
    selectedTournamentIds.length === 0
      ? "Select at least one tournament"
      : Object.values(selectedTeamIds).some((ids) => ids.length === 0)
      ? "Select at least one team for each selected tournament"
      : analysisRunning
      ? "Analysis is currently running. Please wait."
      : showAnalysis
      ? "Analysis already run. Refresh to run again."
      : "";

  return (
    <Tooltip label={tooltipLabel} disabled={!isDisabled} position="top">
      <Button
        disabled={isDisabled}
        onClick={onRunAnalysis}
        mb="md"
        loading={analysisRunning}
      >
        Run Analysis
      </Button>
    </Tooltip>
  );
}
