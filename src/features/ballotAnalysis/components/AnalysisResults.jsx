import { Space } from "@mantine/core";
import RefreshAnalysisButton from "./RefreshAnalysisButton";
import TournamentSummariesSection from "./TournamentSummariesSection";
import OverallScoresSection from "./OverallScoresSection";
import AnalysisTrendsSection from "./AnalysisTrendsSection";

export default function AnalysisResults({
  handleRefresh,
  neededTournamentData,
  calculatedTeamScores,
  allTeamScores,
  attorneys,
  witnesses,
}) {
  return (
    <>
      <RefreshAnalysisButton onRefresh={handleRefresh} />

      <Space h="md" />

      <TournamentSummariesSection
        neededTournamentData={neededTournamentData}
        calculatedTeamScores={calculatedTeamScores}
        allTeamScores={allTeamScores}
      />

      <Space h="md" />

      <OverallScoresSection attorneys={attorneys} witnesses={witnesses} />

      <Space h="md" />

      <AnalysisTrendsSection attorneys={attorneys} witnesses={witnesses} />
    </>
  );
}
