import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import useNotifications from "../../../../common/hooks/useNotifications";

export default function useCasesData() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  const { data: cases, isLoading } = useQuery({
    queryKey: ["admin-cases"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from("cases").select("*");
        if (error) throw error;
        if (data?.length === 0) return [];

        data.sort((a, b) => {
          if (a.is_active && !b.is_active) return -1; // Active cases first
          if (!a.is_active && b.is_active) return 1; // Inactive cases
          return 0; // Keep original order for same status
        });

        return data;
      } catch (error) {
        showError({ title: "Failed to load cases", message: error.message });
      }
    },
  });

  const addMutation = useMutation({
    mutationFn: async ({ name, year, type, area = null, is_active }) => {
      const safeArea = area?.trim() ? area : null;

      const { error } = await supabase
        .from("cases")
        .insert({ name, year, type, area: safeArea, is_active });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-cases"]);
      showSuccess({ message: "Case added successfully" });
    },
    onError: (error) => {
      showError({ message: error.message, title: "Failed to add case" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      if (updates.area === "" || updates.area?.length === 0) {
        updates.area = null;
      }

      const { error } = await supabase
        .from("cases")
        .update(updates)
        .eq("id", id);
      if (error) console.error("Update error:", error);
      if (error) console.error(updates);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-cases"]);
      showSuccess({ message: "Case updated successfully" });
    },
    onError: (error) => {
      showError({ message: error.message, title: "Failed to update case" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("cases").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-cases"]);
      showSuccess({ message: "Case deleted successfully" });
    },
    onError: (error) => {
      showError({ message: error.message, title: "Failed to delete case" });
    },
  });

  return {
    cases,
    isLoading,
    addCase: addMutation.mutateAsync,
    updateCase: updateMutation.mutateAsync,
    deleteCase: deleteMutation.mutateAsync,
  };
}
