import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import useNotifications from "../../../common/hooks/useNotifications";

export function useArchiveStudent() {
  const { showSuccess, showError } = useNotifications();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ studentId, schoolId }) => {
      const { data, error } = await supabase
        .from("students")
        .update({ is_active: false })
        .eq("id", studentId)
        .eq("school_id", schoolId);
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      showSuccess({
        message: "The student has been archived",
      });
      queryClient.invalidateQueries(["school-students", variables.schoolId]);
    },
    onError: (error) => {
      showError({
        title: "Failed to archive student",
        message: error.message,
      });
    },
  });
}

export function useUnarchiveStudent() {
  const { showSuccess, showError } = useNotifications();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ studentId, schoolId }) => {
      const { data, error } = await supabase
        .from("students")
        .update({ is_active: true })
        .eq("id", studentId)
        .eq("school_id", schoolId);
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      showSuccess({
        message: "The student has been unarchived",
      });
      queryClient.invalidateQueries(["school-students", variables.schoolId]);
    },
    onError: (error) => {
      showError({
        title: "Failed to unarchive student",
        message: error.message,
      });
    },
  });
}
