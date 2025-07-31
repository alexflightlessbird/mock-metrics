import { Grid, Text, Space, Anchor } from "@mantine/core";
import BasePage from "../common/components/BasePage";
import { useLocalStorage } from "@mantine/hooks";
import Loader from "../common/components/loader/GavelLoader";
import { useNavigate, useParams } from "react-router-dom";
import { useTournamentDetails, useTournamentTeams } from "../common/hooks/useTournamentDetails";
import PageSection from "../common/components/PageSection";
import { capitalize } from "../common/utils/helpers";
import TeamCard from "../features/tournamentInfo/components/TeamCard";

export default function TournamentDashboard() {
        const [selectedSchoolId] = useLocalStorage({
        key: "school",
        defaultValue: null
    });
    const { id: tournamentId } = useParams();
    const navigate = useNavigate();

    const { data: selectedTournament, isLoading: tournamentLoading = true } = useTournamentDetails(tournamentId, selectedSchoolId);
    const { data: teams, isLoading: teamsLoading = true } = useTournamentTeams(tournamentId);

    if (tournamentLoading || teamsLoading) return (
        <BasePage titleText="Loading...">
            <Loader scale={1.5} />
        </BasePage>
    )

    if (!selectedTournament || Object.keys(selectedTournament).length === 0) return (
        <BasePage titleText="Invalid Tournament">
            <Text>Please check the tournament ID and try again.</Text>
        </BasePage>
    )

    return (
        <BasePage titleText={selectedTournament.name}>
            <PageSection title="information">
                <Text>Year: {selectedTournament.year}</Text>
                <Text>Type: {selectedTournament.type === "pre-stack" ? "Pre-Stack" : selectedTournament.type === "post-stack" ? "Post-Stack" : ""}</Text>
                <Text>Area: {capitalize(selectedTournament.area)}</Text>
                <Text>Associated Case:{" "}
                    <Anchor 
                        href={`/cases/${selectedTournament.case_id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(`/cases/${selectedTournament.case_id}`)
                        }}
                    >
                        {selectedTournament.cases.name}
                    </Anchor></Text>
            </PageSection>

            <Space h="md" />

            <PageSection title="teams">
                <Grid>
                    {teams.map((t) =>
                        <Grid.Col key={t.team_id} span={{ base: 12, sm: 6, md: 4 }}>
                            <TeamCard team={t} caseType={selectedTournament.cases.type} key={t.team_id} />
                        </Grid.Col>
                    )}
                </Grid>
            </PageSection>
        </BasePage>
    )
}