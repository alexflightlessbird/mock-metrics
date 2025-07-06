import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import { notifications } from "@mantine/notifications";

export function useUserAssignments(userId) {
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
    queryKey: ["admin-user-assignments", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("users_schools")
        .select("school_id, role, schools:school_id (id, name)")
        .eq("user_id", userId);
      if (error) throw error;
      return data;
    },
  });

  const { data: availableSchools } = useQuery({
    queryKey: ["admin-available-schools", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data: assignedSchools, error: assignedError } = await supabase
        .from("users_schools")
        .select("school_id")
        .eq("user_id", userId);
      if (assignedError) throw assignedError;

      if (!assignedSchools?.length) {
        const { data, error } = await supabase.from("schools").select("id");
        if (error) throw error;
        return data;
      }

      const assignedSchoolIds = assignedSchools.map((s) => s.school_id);

      const { data, error } = await supabase
        .from("schools")
        .select("id")
        .not("id", "in", `(${assignedSchoolIds.join(",")})`);
      if (error) throw error;
      return data;
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
      refetch();
      queryClient.invalidateQueries(["admin-available-schools", userId]);
      queryClient.invalidateQueries(["admin-user-assignments", userId]);
      showNotification({
        title: "Success",
        message: "School assigned successfully",
        color: "green",
      });
    },
    onError: (error) => {
      showNotification({
        title: "Error",
        message: error.message || "Failed to assign school",
        color: "red",
      });
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
      refetch();
      queryClient.invalidateQueries(["admin-available-schools", userId]);
      queryClient.invalidateQueries(["admin-user-assignments", userId]);
      showNotification({
        title: "Success",
        message: "Assignment updated successfully",
        color: "green",
      });
    },
    onError: (error) => {
      showNotification({
        title: "Error",
        message: error.message || "Failed to update assignment",
        color: "red",
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
      refetch();
      queryClient.invalidateQueries(["admin-available-schools", userId]);
      queryClient.invalidateQueries(["admin-user-assignments", userId]);
      showNotification({
        title: "Success",
        message: "Assignment deleted successfully",
        color: "green",
      });
    },
    onError: (error) => {
      showNotification({
        title: "Error",
        message: error.message || "Failed to delete assignment",
        color: "red",
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
