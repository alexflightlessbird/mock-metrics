import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import useNotifications from "./useNotifications";

export function useTournamentDetails(tournamentId, schoolId) {
    const { showSuccess, showError } = useNotifications();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["tournament-details", tournamentId, schoolId],
        queryFn: async () => {
            if (!tournamentId || !schoolId) return {};

            try {
                const { data, error } = await supabase
                    .from("tournaments")
                    .select("*, cases(*)")
                    .eq("id", tournamentId)
                    .eq("school_id", schoolId)
                    .maybeSingle();
                if (error) throw error;
                return data;
            } catch (error) {
                showError({
                    title: "Failed to load tournament details",
                    message: error.message
                });
                return {};
            }
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            const { error } = await supabase.from("tournaments").delete().eq("id", tournamentId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["school-tournaments", schoolId], ["tournament-details", tournamentId, schoolId]);
            showSuccess({ message: "Tournament deleted successfully" });
        },
        onError: (error) => {
            showError({ message: error.message, title: "Failed to delete tournament" });
        }
    })

    return {
        data,
        isLoading,
        deleteTournament: deleteMutation.mutateAsync,
    };
}

export function useTournamentTeams(tournamentId) {
    const { showError } = useNotifications();

    const { data, isLoading } = useQuery({
        queryKey: ["tournament-teams", tournamentId],
        queryFn: async () => {
            if (!tournamentId) return [];

            try {
                const { data, error } = await supabase
                    .from("teams_tournaments")
                    .select("*, teams(*), tournaments(case_id)")
                    .eq("tournament_id", tournamentId);
                if (error) throw error;
                return data;
            } catch (error) {
                showError({
                    title: "Failed to load tournament teams",
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

export function useTournamentTeamRounds(tournamentId, teamId) {
    const { showError } = useNotifications();

    const { data, isLoading } = useQuery({
        queryKey: ["tournament-team-rounds", tournamentId, teamId],
        queryFn: async () => {
            if (!tournamentId || !teamId) return [];

            try {
                const { data, error } = await supabase
                    .from("rounds")
                    .select("*")
                    .eq("tournament_id", tournamentId)
                    .eq("team_id", teamId);
                if (error) throw error;
                return data;
            } catch (error) {
                showError({
                    title: "Failed to load tournament team rounds",
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