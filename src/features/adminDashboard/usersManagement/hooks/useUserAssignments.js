import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import useNotifications from "../../../../common/hooks/useNotifications";

export function useUserAssignments(userId) {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  const { data: assignments, isLoading } = useQuery({
    queryKey: ["admin-user-assignments", userId],
    queryFn: async () => {
      if (!userId) return [];

      try {
        const { data, error } = await supabase
          .from("users_schools")
          .select("school_id, role, schools:school_id (id, name)")
          .eq("user_id", userId);
        if (error) throw error;
        if (data?.length === 0) return [];
        return data;
      } catch (error) {
        showError({
          title: "Failed to load assignments",
          message: error.message,
        });
      }
    },
  });

  const { data: availableSchools } = useQuery({
    queryKey: ["admin-available-schools", userId],
    queryFn: async () => {
      if (!userId) return [];

      try {
        const { data: assignedSchools, error: assignedError } = await supabase
          .from("users_schools")
          .select("school_id")
          .eq("user_id", userId);
        if (assignedError) throw assignedError;

        if (!assignedSchools?.length) {
          const { data, error } = await supabase.from("schools").select("id");
          if (error) throw error;
          if (data?.length === 0) return [];
          return data;
        }

        const assignedSchoolIds = assignedSchools.map((s) => s.school_id);

        const { data, error } = await supabase
          .from("schools")
          .select("id")
          .not("id", "in", `(${assignedSchoolIds.join(",")})`);
        if (error) throw error;
        if (data?.length === 0) return [];
        return data;
      } catch (error) {
        showError({
          title: "Failed to load available schools",
          message: error.message,
        });
      }
    },
  });

  const addMutation = useMutation({
    mutationFn: async ({ schoolId, role }) => {
      const { error } = await supabase
        .from("users_schools")
        .insert({ user_id: userId, school_id: schoolId, role });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-available-schools", userId]);
      queryClient.invalidateQueries(["admin-user-assignments", userId]);
      showSuccess({ message: "School assigned successfully" });
    },
    onError: (error) => {
      showError({ message: error.message, title: "Failed to assign school" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ schoolId, role }) => {
      const { error } = await supabase
        .from("users_schools")
        .update({ role })
        .eq("school_id", schoolId)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-available-schools", userId]);
      queryClient.invalidateQueries(["admin-user-assignments", userId]);
      showSuccess({ message: "Assignment updated successfully" });
    },
    onError: (error) => {
      showError({
        message: error.message,
        title: "Failed to update assignment",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ schoolId }) => {
      const { error } = await supabase
        .from("users_schools")
        .delete()
        .eq("school_id", schoolId)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-available-schools", userId]);
      queryClient.invalidateQueries(["admin-user-assignments", userId]);
      showSuccess({ message: "Assignment deleted successfully" });
    },
    onError: (error) => {
      showError({
        message: error.message,
        title: "Failed to delete assignment",
      });
    },
  });

  return {
    assignments,
    availableSchools,
    isLoading,
    addAssignment: addMutation.mutateAsync,
    updateAssignment: updateMutation.mutateAsync,
    deleteAssignment: deleteMutation.mutateAsync,
  };
}
