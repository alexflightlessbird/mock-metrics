import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import logger from "../utils/logger";
import useNotifications from "./useNotifications";

export function useUserDetails(userId) {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useNotifications();
  const { data, isLoading } = useQuery({
    queryKey: ["user-details", userId],
    queryFn: async () => {
      if (!userId) return null;

      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .maybeSingle();
        if (error) throw error;
        return data;
      } catch (error) {
        logger.error("Error in loading user details", error);
        return {};
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (name) => {
      const { data: updatedUser, error } = await supabase
        .from("users")
        .update({ name })
        .eq("id", userId)
        .select("id")
        .maybeSingle();

      if (error) throw error;
      if (!updatedUser) {
        throw new Error("Your account profile could not be found.");
      }

      return name;
    },
    onSuccess: (name) => {
      queryClient.setQueryData(["user-details", userId], (currentData) => ({
        ...currentData,
        name,
      }));
      showSuccess({ message: "Your name has been updated" });
    },
    onError: (error) => {
      showError({
        title: "Failed to update name",
        message: error.message,
      });
    },
  });

  return {
    data,
    isLoading,
    updateName: updateMutation.mutate,
    isUpdatingName: updateMutation.isPending,
  };
}
