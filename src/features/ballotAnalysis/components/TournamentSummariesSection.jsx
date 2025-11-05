import { Stack } from "@mantine/core";
import PageSection from "../../../common/components/PageSection";
import TournamentSummaryCard from "./TournamentSummaryCard";
import TeamCard from "./TeamCard";

export default function TournamentSummariesSection({
    neededTournamentData,
    calculatedTeamScores,
    allTeamScores,
}) {
    return (
        <PageSection title="tournament summaries" collapsible defaultOpen>
            {neededTournamentData.map(tournament => {
                const tournamentTeamScores = calculatedTeamScores.find(ts => ts.tournamentId === tournament.id);
                const summaryTeamScores = allTeamScores.filter(ts => ts.tournamentId === tournament.id);

                return (
                    <Stack gap="md" key={tournament.id}>
                        <TournamentSummaryCard 
                            tournament={tournament} 
                            allTeamScores={summaryTeamScores}
                        >
                            {tournament.teams.map(team => (
                                <TeamCard
                                    key={team.id}
                                    team={team}
                                    tournamentTeamScores={tournamentTeamScores}
                                    tournamentName={tournament.name}
                                />
                            ))}
                        </TournamentSummaryCard>
                    </Stack>
                );
            })}
        </PageSection>
    );
}