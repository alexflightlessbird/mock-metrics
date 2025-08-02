import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import useNotifications from "./useNotifications";

export function useCaseDetails(caseId) {
  const { showError } = useNotifications();

  const { data, isLoading } = useQuery({
    queryKey: ["case-details", caseId],
    queryFn: async () => {
      if (!caseId) return {};

      try {
        const { data, error } = await supabase
          .from("cases")
          .select("*, witnesses(*)")
          .eq("id", caseId)
          .maybeSingle();
        if (error) throw error;
        return data;
      } catch (error) {
        showError({
          title: "Failed to load case details",
          message: error.message,
        });
        return {};
      }
    },
  });

  return {
    data,
    isLoading,
  };
}
