import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import useNotifications from "../../../common/hooks/useNotifications";

export function useAddStudent() {
  const { showSuccess, showError } = useNotifications();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ schoolId, name, yearsInMock = 1 }) => {
      const { data, error } = await supabase.from("students").insert({
        school_id: schoolId,
        name: name.trim(),
        years_in_mock: yearsInMock,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      showSuccess({
        message: "The student has been created",
      });
      queryClient.invalidateQueries(["school-students", variables.schoolId]);
    },
    onError: (error) => {
      showError({
        title: "Failed to add student",
        message: error.message,
      });
    },
  });
}
