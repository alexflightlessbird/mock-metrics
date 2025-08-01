import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import useNotifications from "./useNotifications";

export function useRoundDetails(roundId) {
    const { showSuccess, showError } = useNotifications();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["round-details", roundId],
        queryFn: async () => {
            if (!roundId) return {};

            try {
                const { data, error } = await supabase
                    .from("rounds")
                    .select("*, role_rounds(*, students(*)), witness_rounds(*, witnesses(*))")
                    .eq("id", roundId)
                    .maybeSingle();
                if (error) throw error;
                return data;
            } catch (error) {
                showError({
                    title: "Failed to load round details",
                    message: error.message
                });
                return {};
            }
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async ({ roundId, tournamentId, teamId }) => {
            const { error } = await supabase.from("rounds").delete().eq("id", roundId);
            if (error) throw error;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(["tournament-team-rounds", variables.tournamentId, variables.teamId], ["round-details", variables.roundId]);
            showSuccess({ message: "Round deleted sucessfully" });
        },
        onError: (error) => {
            showError({ message: error.message, title: "Failed to delete round" });
        }
    })

    return {
        data,
        isLoading,
        deleteRound: deleteMutation.mutateAsync
    }
}

export function useRoundBallots(roundId) {
    const { showError } = useNotifications();

    const { data, isLoading } = useQuery({
        queryKey: ["round-ballots", roundId],
        queryFn: async () => {
            if (!roundId) return [];

            try {
                const { data, error } = await supabase
                    .from("ballots")
                    .select("*, scores(*)")
                    .eq("round_id", roundId);
                if (error) throw error;
                return data;
            } catch (error) {
                showError({
                    title: "Failed to load round ballots",
                    message: error.message,
                });
                return [];
            }
        },
    });

    return {
        data,
        isLoading,
    }
}