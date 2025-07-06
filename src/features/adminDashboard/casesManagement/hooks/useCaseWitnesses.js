import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import useNotifications from "../../../../common/hooks/useNotifications";

export default function useCaseWitnesses(caseId) {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  const { data: witnesses, isLoading } = useQuery({
    queryKey: ["admin-case-witnesses", caseId],
    queryFn: async () => {
      if (!caseId) return [];

      try {
        const { data, error } = await supabase
          .from("witnesses")
          .select("*")
          .eq("case_id", caseId)
          .order("name");
        if (error) throw error;
        return data;
      } catch (error) {
        showError({
          title: "Failed to load witnesses",
          message: error.message,
        });
      }
    },
  });

  const addMutation = useMutation({
    mutationFn: async ({ name, side, type }) => {
      const { error } = await supabase.from("witnesses").insert({
        name,
        side,
        type,
        case_id: caseId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-case-witnesses", caseId]);
      showSuccess({ message: "Witness added successfully" });
    },
    onError: (error) => {
      showError({ message: error.message, title: "Failed to add witness" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      const { error } = await supabase
        .from("witnesses")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-case-witnesses", caseId]);
      showSuccess({ message: "Witness updated successfully" });
    },
    onError: (error) => {
      showError({ message: error.message, title: "Failed to update witness" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("witnesses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-case-witnesses", caseId]);
      showSuccess({ message: "Witness deleted successfully" });
    },
    onError: (error) => {
      showError({
        message: error.message,
        title: "Failed to delete witness",
      });
    },
  });

  return {
    witnesses,
    isLoading,
    addWitness: addMutation.mutate,
    updateWitness: updateMutation.mutate,
    deleteWitness: deleteMutation.mutate,
  };
}
