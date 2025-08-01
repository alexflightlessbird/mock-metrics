import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import useNotifications from "../../../common/hooks/useNotifications";

export function useRoundBallots(rounds) {
    const { showError } = useNotifications();
    const queryClient = useQueryClient();
    const roundIds = rounds?.map(r => r.id) || [];

    const { data, isLoading } = useQuery({
        queryKey: ["round-ballots", roundIds],
        queryFn: async () => {
            if (!roundIds.length) return [];

            try {
                const { data: ballotsData, error } = await supabase
                    .from("ballots")
                    .select("*, scores(*)")
                    .in("round_id", roundIds);

                if (error) throw error;

                return rounds.map(round => {
                    const roundBallots = ballotsData?.filter(b => b.round_id === round.id);

                    if (roundBallots.length === 0) {
                        return {
                            ...round,
                            result: "0-0",
                            pointDiff: "+0",
                            ballots: 0
                        };
                    }

                    let wins = 0;
                    let losses = 0;
                    let ties = 0;
                    let pointDiff = 0;

                    roundBallots.forEach(ballot => {
                        const scores = ballot.scores || [];
                        const pScores = scores.filter(s => s.score_type.toLowerCase().startsWith("p"));
                        const dScores = scores.filter(s => s.score_type.toLowerCase().startsWith("d"));
                        const pTotal = pScores.reduce((sum, s) => sum + s.score_value, 0);
                        const dTotal = dScores.reduce((sum, s) => sum + s.score_value, 0);

                        pointDiff += (round.side === "p" ? pTotal - dTotal : dTotal - pTotal);

                        if (pTotal === dTotal) {
                            ties++;
                        } else if (
                            (round.side === "p" && pTotal > dTotal) ||
                            (round.side === "d" && dTotal > pTotal)
                        ) {
                            wins++;
                        } else {
                            losses++;
                        }
                    });

                    return {
                        ...round,
                        result: `${wins}-${losses}${ties > 0 ? `-${ties}` : ""}`,
                        pointDiff: `${pointDiff >= 0 ? "+" : ""}${pointDiff}`,
                        ballots: roundBallots.length
                    };
                });
            } catch (error) {
                showError({
                    title: "Failed to load round ballots",
                    message: error.message
                });
                return rounds.map(round => ({
                    ...round,
                    result: "Error",
                    pointDiff: "?",
                    ballots: 0
                }));
            }
        },
    });

    const refreshBallots = () => {
        queryClient.invalidateQueries(["round-ballots", roundIds]);
    }

    return {
        data,
        isLoading,
        refreshBallots
    };
}