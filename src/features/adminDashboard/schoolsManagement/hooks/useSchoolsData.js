import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import { notifications } from "@mantine/notifications";

export default function useSchoolsData() {
  const queryClient = useQueryClient();

  const showNotification = ({
    title,
    message,
    color,
    position = "bottom-right",
  }) => {
    notifications.show({ title, message, color, position });
  };

  const { data: schools, isLoading } = useQuery({
    queryKey: ["admin-schools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async ({ name, short_name, is_premium }) => {
      const { error } = await supabase
        .from("schools")
        .insert({ name, short_name, is_premium });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-schools"]);
      showNotification({
        title: "Success",
        message: "School added successfully",
        color: "green",
      });
    },
    onError: (error) => {
      showNotification({
        title: "Add failed",
        message: error.message || "Failed to add school",
        color: "red",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      const { error } = await supabase
        .from("schools")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-schools"]);
      showNotification({
        title: "Success",
        message: "School updated successfully",
        color: "green",
      });
    },
    onError: (error) => {
      showNotification({
        title: "Update failed",
        message: error.message || "Failed to update school",
        color: "red",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("schools").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-schools"]);
      showNotification({
        title: "Success",
        message: "School deleted successfully",
        color: "green",
      });
    },
    onError: (error) => {
      showNotification({
        title: "Delete failed",
        message: error.message || "Failed to delete school",
        color: "red",
      });
    },
  });

  return {
    schools,
    isLoading,
    addSchool: addMutation.mutateAsync,
    updateSchool: updateMutation.mutateAsync,
    deleteSchool: deleteMutation.mutateAsync,
  };
}
