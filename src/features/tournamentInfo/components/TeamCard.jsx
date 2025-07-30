import { Badge, Card, Flex, Skeleton, Stack, Text } from "@mantine/core";
import { useTournamentTeamRounds } from "../../../common/hooks/useTournamentDetails";
import { useState } from "react";
import RoundTable from "./RoundTable";

export default function TeamCard({ team, caseType }) {
    const [showRounds, setShowRounds] = useState(false);
    const { data: rounds, isLoading: roundsLoading } = useTournamentTeamRounds(team.tournament_id, team.team_id);

    if (roundsLoading) return (
        <Card withBorder shadow="md" radius="md">
            <Skeleton h={30} />
        </Card>
    )

    rounds.sort((a, b) => a.round_number - b.round_number);

    // FAKE DATA HERE
    const fakeRoundData = rounds.map((r) => ({
        ...r,
        ballots: Math.floor(Math.random() * 3) + 1,
        result: ["2-0", "1-1", "0-2", "1-0-1", "0-1-1"][Math.floor(Math.random() * 5)],
        pointDiff: ["+21", "-5", "+13", "-45", "+7"][Math.floor(Math.random() * 5)]
    }));

    const calculateRecord = () => {
        let wins = 0;
        let losses = 0;
        let ties = 0;

        fakeRoundData.forEach((r) => {
            const [winStr, lossStr, tieStr] = r.result.split("-");
            wins += parseInt(winStr) || 0;
            losses += parseInt(lossStr) || 0;
            ties += parseInt(tieStr) || 0;
        });

        return { wins, losses, ties };
    }

    const record = calculateRecord();

    const recordVal = record.wins + (record.ties * 0.5);
    const totalRecordVal = record.wins + record.losses + record.ties;

    return (
        <Card withBorder shadow="md" radius="md">
            <Card.Section withBorder inheritPadding py="sm">
                <Flex justify="space-between" align="center">
                    <Text fw={500}>{team.teams.name}</Text>
                    <Badge fz="sm" color={recordVal > totalRecordVal - recordVal ? "blue" : recordVal == totalRecordVal - recordVal ? "gray" : "pink"}>{record.wins}-{record.losses}-{record.ties}</Badge>
                </Flex>
            </Card.Section>

            <Card.Section inheritPadding py="sm">
                <Stack gap="xs">
                    <Text span style={{ cursor: "pointer", userSelect: "none", WebkitUserSelect: "none" }} c="blue" onClick={() => { setShowRounds(!showRounds); }} tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.onClick(); }}}>
                        {showRounds ? "Hide Rounds" : "Show Rounds"}
                    </Text>
                    {showRounds && Object.keys(rounds).length > 0 && (
                        <>
                            <Text fw={500} size="sm">Rounds:</Text>
                            <RoundTable data={fakeRoundData} caseType={caseType} />
                        </>
                    )}
                    {showRounds && Object.keys(rounds).length == 0 && (
                        <Text c="dimmed">No rounds associated with this team.</Text>
                    )}
                </Stack>
            </Card.Section>
        </Card>
    )
}