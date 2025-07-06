import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import useNotifications from "../../../../common/hooks/useNotifications";

export default function useUsersData() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .order("email");
        if (error) throw error;
        return data;
      } catch (error) {
        showError({ title: "Failed to load users", message: error.message });
      }
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
      showSuccess({ message: "User updated successfully" });
    },
    onError: (error) => {
      showError({ message: error.message, title: "Failed to update user" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("users").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-users"]);
      showSuccess({ message: "User deleted successfully" });
    },
    onError: (error) => {
      showError({ message: error.message, title: "Failed to delete user" });
    },
  });

  return {
    users,
    isLoading,
    updateUser: updateMutation.mutateAsync,
    deleteUser: deleteMutation.mutateAsync,
  };
}
