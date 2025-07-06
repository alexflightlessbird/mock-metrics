import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import useNotifications from "../../../../common/hooks/useNotifications";

export default function useSchoolsData() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  const { data: schools, isLoading } = useQuery({
    queryKey: ["admin-schools"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from("schools").select("*");
        if (error) throw error;
        if (data?.length === 0) return [];

        data.sort((a, b) => {
          if (a.name && b.name) {
            return a.name.localeCompare(b.name);
          }
          return 0; // If names are not available, keep original order
        });

        return data;
      } catch (error) {
        showError({ title: "Failed to load schools", message: error.message });
      }
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
      showSuccess({ message: "School added successfully" });
    },
    onError: (error) => {
      showError({ title: "Failed to add school", message: error.message });
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
      showSuccess({ message: "School updated successfully" });
    },
    onError: (error) => {
      showError({ title: "Failed to update school", message: error.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("schools").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-schools"]);
      showSuccess({ message: "School deleted successfully" });
    },
    onError: (error) => {
      showError({ title: "Failed to delete school", message: error.message });
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
