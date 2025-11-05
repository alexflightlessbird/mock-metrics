import { Space, Title } from "@mantine/core";
import PageSection from "../../../common/components/PageSection";
import AttorneyTable from "./AttorneyTable";
import WitnessTable from "./WitnessTable";

export default function OverallScoresSection ({ attorneys, witnesses }) {
    return (
        <PageSection title="overall scores">
            <Title order={3} mb="sm">Attorneys</Title>
            <AttorneyTable showTeam={true} allScores={attorneys} />

            <Space h="sm" />

            <Title order={3} mb="sm">Witnesses</Title>
            <WitnessTable showTeam={true} allScores={witnesses} />
        </PageSection>
    )
}