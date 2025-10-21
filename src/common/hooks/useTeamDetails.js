import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import useNotifications from "./useNotifications";

export function useTeamDetails(teamId) {
  const { showError } = useNotifications();

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

  return {
    data,
    isLoading,
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
