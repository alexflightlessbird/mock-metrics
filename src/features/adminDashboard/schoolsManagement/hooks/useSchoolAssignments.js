import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import useNotifications from "../../../../common/hooks/useNotifications";

export function useSchoolAssignments(schoolId) {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  const { data: assignments, isLoading } = useQuery({
    queryKey: ["admin-school-assignments", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];

      try {
        const { data, error } = await supabase
          .from("users_schools")
          .select("user_id, role, users:user_id (id, email, name)")
          .eq("school_id", schoolId);
        if (error) throw error;
        if (data?.length === 0) return [];
        return data;
      } catch (error) {
        showError({
          message: error.message,
          title: "Failed to load assignments",
        });
      }
    },
  });

  const { data: availableUsers } = useQuery({
    queryKey: ["admin-available-users", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];

      try {
        const { data: assignedUsers, error: assignedError } = await supabase
          .from("users_schools")
          .select("user_id")
          .eq("school_id", schoolId);
        if (assignedError) throw assignedError;

        if (!assignedUsers?.length) {
          const { data, error } = await supabase.from("users").select("id");
          if (error) throw error;
          if (data?.length === 0) return [];
          return data;
        }

        const assignedUserIds = assignedUsers.map((u) => u.user_id);

        const { data, error } = await supabase
          .from("users")
          .select("id")
          .not("id", "in", `(${assignedUserIds.join(",")})`);
        if (error) throw error;
        if (data?.length === 0) return [];
        return data;
      } catch (error) {
        showError({
          message: error.message,
          title: "Failed to load available users",
        });
      }
    },
  });

  const addMutation = useMutation({
    mutationFn: async ({ userId, role }) => {
      const { error } = await supabase
        .from("users_schools")
        .insert({ user_id: userId, school_id: schoolId, role });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-available-users", schoolId]);
      queryClient.invalidateQueries(["admin-school-assignments", schoolId]);
      showSuccess({ message: "User assigned successfully" });
    },
    onError: (error) => {
      showError({ title: "Failed to assign user", message: error.message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ userId, role }) => {
      const { error } = await supabase
        .from("users_schools")
        .update({ role })
        .eq("school_id", schoolId)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-available-users", schoolId]);
      queryClient.invalidateQueries(["admin-school-assignments", schoolId]);
      showSuccess({ message: "Assignment updated successfully" });
    },
    onError: (error) => {
      showError({
        title: "Failed to update assignment",
        message: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ userId }) => {
      const { error } = await supabase
        .from("users_schools")
        .delete()
        .eq("user_id", userId)
        .eq("school_id", schoolId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-available-users", schoolId]);
      queryClient.invalidateQueries(["admin-school-assignments", schoolId]);
      showSuccess({ message: "Assignment deleted successfully" });
    },
    onError: (error) => {
      showError({
        title: "Failed to delete assignment",
        message: error.message,
      });
    },
  });

  return {
    assignments,
    availableUsers,
    isLoading,
    addAssignment: addMutation.mutateAsync,
    updateAssignment: updateMutation.mutateAsync,
    deleteAssignment: deleteMutation.mutateAsync,
  };
}
