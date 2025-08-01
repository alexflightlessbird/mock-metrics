import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import useNotifications from "./useNotifications";

export function useBallotDetails(ballotId) {
    const { showSuccess, showError } = useNotifications();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["ballot-details", ballotId],
        queryFn: async () => {
            if (!ballotId) return {};

            try {
                const { data, error } = await supabase
                    .from("ballots")
                    .select("*, scores(*)")
                    .eq("id", ballotId)
                    .maybeSingle();
                if (error) throw error;
                return data;
            } catch (error) {
                showError({
                    title: "Failed to load ballot details",
                    message: error.message,
                });
                return {};
            }
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async ({ ballotId, roundId }) => {
            const { error } = await supabase.from("ballots").delete().eq("id", ballotId);
            if (error) throw error;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(["round-ballots", variables.roundId], ["ballot-details", variables.ballotId]);
            showSuccess({ message: "Ballot deleted successfully" });
        },
        onError: (error) => {
            showError({ message: error.message, title: "Failed to delete ballot" });
        }
    })

    return {
        data,
        isLoading,
        deleteBallot: deleteMutation.mutateAsync,
    }
}