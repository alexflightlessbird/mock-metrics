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
          message: error.message,
        });
        return {};
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updates) => {
      if (!updates || Object.keys(updates).length === 0)
        return { noUpdates: true };
      const { error } = await supabase
        .from("tournaments")
        .update(updates)
        .eq("id", tournamentId);
      if (error) throw error;

      return { noUpdates: false };
    },
    onSuccess: (result) => {
      if (result.noUpdates) {
        showSuccess({ message: "No changes to update", title: "No changes" });
      } else {
        queryClient.invalidateQueries([
          "tournament-details",
          tournamentId,
          schoolId,
        ]);
        showSuccess({ message: "Tournament updated successfully" });
      }
    },
    onError: (error) => {
      showError({
        title: "Failed to update tournament",
        message: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("tournaments")
        .delete()
        .eq("id", tournamentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(
        ["school-tournaments", schoolId],
        ["tournament-details", tournamentId, schoolId]
      );
      showSuccess({ message: "Tournament deleted successfully" });
    },
    onError: (error) => {
      showError({
        message: error.message,
        title: "Failed to delete tournament",
      });
    },
  });

  return {
    data,
    isLoading,
    deleteTournament: deleteMutation.mutateAsync,
    updateTournament: updateMutation.mutateAsync,
  };
}

export function useTournamentTeams(tournamentId) {
  const { showError, showSuccess } = useNotifications();
  const queryClient = useQueryClient();

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
          message: error.message,
        });
        return [];
      }
    },
  });

  const addTeamMutation = useMutation({
    mutationFn: async ({ teamId, tournamentId }) => {
      const { error } = await supabase.from("teams_tournaments").insert({
        team_id: teamId,
        tournament_id: tournamentId,
      });
      if (error) throw error;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries([
        "tournament-teams",
        variables.tournamentId,
      ]);
      showSuccess({ message: "Team added to tournament successfully" });
    },
    onError: (error) => {
      showError({
        title: "Failed to add team to tournament",
        message: error.message,
      });
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async ({ teamId, tournamentId }) => {
      const { error: roundsError } = await supabase
        .from("rounds")
        .delete()
        .eq("team_id", teamId)
        .eq("tournament_id", tournamentId);
      if (roundsError) throw roundsError;

      const { error: teamTournamentError } = await supabase
        .from("teams_tournaments")
        .delete()
        .eq("team_id", teamId)
        .eq("tournament_id", tournamentId);
      if (teamTournamentError) throw teamTournamentError;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries([
        "tournament-teams",
        variables.tournamentId,
      ]);
      showSuccess({ message: "Team removed from tournament successfully" });
    },
    onError: (error) => {
      showError({
        message: error.message,
        title: "Failed to remove team from tournament",
      });
    },
  });

  return {
    data,
    isLoading,
    addTeam: addTeamMutation.mutateAsync,
    removeTeam: deleteTeamMutation.mutateAsync,
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
          message: error.message,
        });
        return [];
      }
    },
  });

  return {
    data,
    isLoading,
  };
}
