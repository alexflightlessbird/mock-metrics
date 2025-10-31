import useNotifications from "../../../common/hooks/useNotifications";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";

export function useGetTournaments(schoolId) {
    const { showError } = useNotifications();

    const { data, isLoading } = useQuery({
        queryKey: ["active-tournament-details", schoolId],
        queryFn: async () => {
            if (!schoolId) return [];

            try {
                const { data, error } = await supabase
                    .from("tournaments")
                    .select("*, teams_tournaments(*, teams(*, students_teams(*, students(*)))), rounds(*, teams(*, students_teams(*, students(*))), ballots(*, scores(*)), witness_rounds(*, witnesses(*)), role_rounds(*, students(*))))")
                    .eq("school_id", schoolId)
                    .eq("is_active", true);
                if (error) throw error;
                return data;
            } catch (error) {
                showError({
                    title: "Failed to load tournaments",
                    message: error.message,
                });
                return [];
            }
        }
    })

    return {
        data,
        isLoading,
    };
}