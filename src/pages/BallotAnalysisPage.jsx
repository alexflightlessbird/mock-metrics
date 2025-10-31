import { Button, MultiSelect, Text } from "@mantine/core";
import BasePage from "../common/components/BasePage";
import { useMemo, useState } from "react";
import { useGetTournaments } from "../features/ballotAnalysis/hooks/useGetTournaments";
import { useAuth } from "../context/AuthContext";
import { useLocalStorage } from "@mantine/hooks";
import ballotAverage from "../features/ballotAnalysis/utils/ballotAverage";

export default function BallotAnalysisPage() {
    const { user } = useAuth();
    const [selectedSchoolId] = useLocalStorage({
        key: "school",
        defaultValue: null,
    });

    const [selectedTournamentIds, setSelectedTournamentIds] = useState([]);
    
    const { data: tournaments, isLoading } = useGetTournaments(selectedSchoolId);

    useMemo(() => {
        if (!tournaments) return;
        console.log(tournaments.map(t => ({
            name: t.name,
            teams: t.teams_tournaments.map(tt => ({
                name: tt.teams.name,
                rounds: t.rounds.filter(r => r.teams.id === tt.team_id).map(r => ({
                    number: r.round_number,
                    ballots: r.ballots.map(b => ({
                        judge: b.judge_name,
                        average: ballotAverage(b.scores).overallAverage,
                    }))
                }))
            })),
        })));
    }, [tournaments]);

    if (isLoading) return (
        <BasePage titleText="Loading...">
            <Text>Loading tournaments...</Text>
        </BasePage>
    );

    return (
        <BasePage titleText="Ballot Analysis">
            <MultiSelect
                data={tournaments.map(t => ({
                    value: t.id,
                    label: `${t.name} (${t.year})`
                }))}
                value={selectedTournamentIds}
                onChange={setSelectedTournamentIds}
                label="Select Tournaments to Analyze"
                mb="md"
                required
            />
            <Button onClick={() => window.alert("Run Analysis")}>Run Analysis</Button>
        </BasePage>
    )
}