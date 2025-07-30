import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import useNotifications from "../../../common/hooks/useNotifications";

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
                    message: error.message
                });
                return [];
            }
        },
    });

    return {
        data,
        isLoading
    };
}