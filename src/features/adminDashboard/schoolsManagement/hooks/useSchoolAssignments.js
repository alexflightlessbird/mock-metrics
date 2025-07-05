import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import { notifications } from "@mantine/notifications";

export function useSchoolAssignments(schoolId) {
  const showNotification = ({
    title,
    message,
    color,
    position = "bottom-right",
  }) => {
    notifications.show({ title, message, color, position });
  };

  const queryClient = useQueryClient();

  const {
    data: assignments,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-school-assignments", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];

      const { data, error } = await supabase
        .from("users_schools")
        .select(`user_id, role, users:user_id (id, email, name)`)
        .eq("school_id", schoolId);
      if (error) throw error;
      return data;
    },
  });

  const { data: availableUsers } = useQuery({
    queryKey: ["admin-available-users", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];

      const { data: assignedUsers, error: assignedError } = await supabase
        .from("users_schools")
        .select("user_id")
        .eq("school_id", schoolId);
      if (assignedError) throw assignedError;

      if (!assignedUsers?.length) {
        const { data, error } = await supabase.from("users").select("id");
        if (error) throw error;
        return data;
      }

      const assignedUserIds = assignedUsers.map((u) => u.user_id);

      const { data, error } = await supabase
        .from("users")
        .select("id")
        .not("id", "in", `(${assignedUserIds.join(",")})`);
      if (error) console.error(error);
      if (error) throw error;
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async ({ userId, role }) => {
      console.log(userId);
      console.log(role);
      const { error } = await supabase
        .from("users_schools")
        .insert({ user_id: userId, school_id: schoolId, role });
      if (error) throw error;
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries(["admin-available-users", schoolId]);
      queryClient.invalidateQueries(["admin-school-assignments", schoolId]);
      showNotification({
        title: "Success",
        message: "User assigned successfully",
        color: "green",
      });
    },
    onError: (error) => {
      showNotification({
        title: "Assignment failed",
        message: error.message || "Failed to assign user",
        color: "red",
      });
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
      refetch();
      queryClient.invalidateQueries(["admin-available-users", schoolId]);
      queryClient.invalidateQueries(["admin-school-assignments", schoolId]);
      showNotification({
        title: "Success",
        message: "Assignment updated successfully",
        color: "green",
      });
    },
    onError: (error) => {
      showNotification({
        title: "Update failed",
        message: error.message || "Failed to update assignment",
        color: "red",
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
      refetch();
      queryClient.invalidateQueries(["admin-available-users", schoolId]);
      queryClient.invalidateQueries(["admin-school-assignments", schoolId]);
      showNotification({
        title: "Success",
        message: "Assignment deleted successfully",
        color: "green",
      });
    },
    onError: (error) => {
      showNotification({
        title: "Delete failed",
        message: error.message || "Failed to delete assignment",
        color: "red",
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
