import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import { notifications } from "@mantine/notifications";

export default function useUsersData() {
  const queryClient = useQueryClient();

  const showNotification = ({
    title,
    message,
    color,
    position = "bottom-right",
  }) => {
    notifications.show({ title, message, color, position });
  };

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("email");
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-users"]);
      showNotification({
        title: "Success",
        message: "User updated successfully",
        color: "green",
      });
    },
    onError: (error) => {
      showNotification({
        title: "Update failed",
        message: error.message || "Failed to update user",
        color: "red",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("users").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-users"]);
      showNotification({
        title: "Success",
        message: "User updated successfully",
        color: "green",
      });
    },
    onError: (error) => {
      showNotification({
        title: "Delete failed",
        message: error.message || "Failed to delete user",
        color: "red",
      });
    },
  });

  return {
    users,
    isLoading,
    updateUser: updateMutation.mutateAsync,
    deleteUser: deleteMutation.mutateAsync,
  };
}
