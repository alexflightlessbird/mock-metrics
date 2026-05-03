import useNotifications from "../../../common/hooks/useNotifications";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";

export function useGetTournamentDetails(tournamentIds) {
    const { showError } = useNotifications();

    const { data, isLoading } = useQuery({
        queryKey: ["tournament-details", tournamentIds],
        queryFn: async () => {
            if (!tournamentIds || tournamentIds.length === 0) return [];

            try {
                const { data, error } = await supabase
                    .from("tournaments")
                    .select(
                        "*, teams_tournaments(*, teams(*, students_teams(*, students(*)))), rounds(*, teams(*, students_teams(*, students(*))), ballots(*, scores(*)), witness_rounds(*, witnesses(*)), role_rounds(*, students(*))))"
                    )
                    .in("id", tournamentIds);
                if (error) throw error;
                return data;
            } catch (error) {
                showError({
                    title: "Failed to load tournament details",
                    message: error.message,
                });
                return [];
            }
        },
        enabled: tournamentIds && tournamentIds.length > 0,
    });

    return {
        data,
        isLoading,
    }
}