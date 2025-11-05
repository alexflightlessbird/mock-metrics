import { Space, Title } from "@mantine/core";
import PageSection from "../../../common/components/PageSection";
import ScoreTable from "./ScoreTable";

export default function OverallScoresSection ({ attorneys, witnesses }) {
    return (
        <PageSection title="overall scores">
            <Title order={3} mb="sm">Attorneys</Title>
            <ScoreTable type="attorney" showTeam={true} allScores={attorneys} />

            <Space h="sm" />

            <Title order={3} mb="sm">Witnesses</Title>
            <ScoreTable type="witness" showTeam={true} allScores={witnesses} />
        </PageSection>
    )
}