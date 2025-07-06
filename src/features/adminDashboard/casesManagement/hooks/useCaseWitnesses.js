import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase";
import { notifications } from "@mantine/notifications";

export default function useCaseWitnesses(caseId) {
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
    data: witnesses,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-case-witnesses", caseId],
    queryFn: async () => {
      if (!caseId) return [];

      const { data, error } = await supabase
        .from("witnesses")
        .select("*")
        .eq("case_id", caseId)
        .order("name");
      if (error) throw error;
      return data;
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
      refetch();
      queryClient.invalidateQueries(["admin-case-witnesses", caseId]);
      showNotification({
        title: "Success",
        message: "Witness added successfully",
        color: "green",
      });
    },
    onError: (error) => {
      showNotification({
        title: "Add failed",
        message: error.message || "Failed to add witness",
        color: "red",
      });
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
      refetch();
      queryClient.invalidateQueries(["admin-case-witnesses", caseId]);
      showNotification({
        title: "Success",
        message: "Witness updated successfully",
        color: "green",
      });
    },
    onError: (error) => {
      showNotification({
        title: "Update failed",
        message: error.message || "Failed to update witness",
        color: "red",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("witnesses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries(["admin-case-witnesses", caseId]);
      showNotification({
        title: "Success",
        message: "Witness deleted successfully",
        color: "green",
      });
    },
    onError: (error) => {
      showNotification({
        title: "Delete failed",
        message: error.message || "Failed to delete witness",
        color: "red",
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
