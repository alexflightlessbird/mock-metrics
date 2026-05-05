import { Space, Title } from "@mantine/core";
import PageSection from "../../../common/components/PageSection";
import ScoreTable from "./ScoreTable";

export default function OverallScoresSection({ attorneys, witnesses }) {
  return (
    <>
      <PageSection title="overall scores - attorneys" collapsible defaultOpen>
        <ScoreTable type="attorney" showTeam={true} allScores={attorneys} />
      </PageSection>

      <Space h="md" />

      <PageSection title="overall scores - witnesses" collapsible defaultOpen>
        <ScoreTable type="witness" showTeam={true} allScores={witnesses} />
      </PageSection>
    </>
  );
}
