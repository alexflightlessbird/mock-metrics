import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import useNotifications from "./useNotifications";

export function useTeamDetails(teamId) {
  const { showSuccess, showError } = useNotifications();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["team-details", teamId],
    queryFn: async () => {
      if (!teamId) return {};

      try {
        const { data, error } = await supabase
          .from("teams")
          .select("*")
          .eq("id", teamId)
          .maybeSingle();
        if (error) throw error;
        return data;
      } catch (error) {
        showError({
          title: "Failed to load team details",
          message: error.message,
        });
        return {};
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ teamId, schoolId }) => {
      const { error } = await supabase
        .from("teams")
        .delete()
        .eq("id", teamId);
      if (error) throw error;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["school-teams", variables.schoolId]);
      showSuccess({ message: "Team deleted successfully" });
    },
    onError: (error) => {
      showError({ message: error.message, title: "Failed to delete team" });
    },
  });

  return {
    data,
    isLoading,
    deleteTeam: deleteMutation.mutateAsync,
  };
}

export function useTeamStudents(teamId) {
  const { showError } = useNotifications();

  const { data, isLoading } = useQuery({
    queryKey: ["team-students", teamId],
    queryFn: async () => {
      if (!teamId) return [];

      try {
        const { data, error } = await supabase
          .from("students_teams")
          .select("*, students(*)")
          .eq("team_id", teamId)
          .eq("is_active", true);
        if (error) throw error;
        return data;
      } catch (error) {
        showError({
          title: "Failed to load team students",
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
