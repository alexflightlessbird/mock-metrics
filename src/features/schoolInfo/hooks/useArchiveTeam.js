import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import useNotifications from "../../../common/hooks/useNotifications";

export function useArchiveTeam() {
  const { showSuccess, showError } = useNotifications();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ teamId, schoolId }) => {
      const { data, error } = await supabase
        .from("teams")
        .update({ is_active: false })
        .eq("id", teamId)
        .eq("school_id", schoolId);
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      showSuccess({
        message: "The team has been archived",
      });
      queryClient.invalidateQueries(["school-teams", variables.schoolId]);
    },
    onError: (error) => {
      showError({
        title: "Failed to archive team",
        message: error.message,
      });
    },
  });
}

export function useUnarchiveTeam() {
  const { showSuccess, showError } = useNotifications();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ teamId, schoolId }) => {
      const { data, error } = await supabase
        .from("teams")
        .update({ is_active: true })
        .eq("id", teamId)
        .eq("school_id", schoolId);
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      showSuccess({
        message: "The team has been unarchived",
      });
      queryClient.invalidateQueries(["school-teams", variables.schoolId]);
    },
    onError: (error) => {
      showError({
        title: "Failed to unarchive team",
        message: error.message,
      });
    },
  });
}
