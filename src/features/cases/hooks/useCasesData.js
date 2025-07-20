import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import useNotifications from "../../../common/hooks/useNotifications";

export function useCasesData() {
  const { showError } = useNotifications();

  const { data, isLoading } = useQuery({
    queryKey: ["cases"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("cases")
          .select("*, witnesses(*)");
        if (error) throw error;
        return data;
      } catch (error) {
        showError({
          title: "Failed to load cases",
          message: error.message,
        });
        return [];
      }
    },
  });

  return {
    data,
    isLoading,
  };
}

export function useCaseDetails(caseId) {
  const { showError } = useNotifications();

  const { data, isLoading } = useQuery({
    queryKey: ["case-details", caseId],
    queryFn: async () => {
      if (!caseId) return {};

      try {
        const { data, error } = await supabase
          .from("cases")
          .select("*")
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

export function useCaseWitnesses(caseId) {
  const { showError } = useNotifications();

  const { data, isLoading } = useQuery({
    queryKey: ["case-witnesses", caseId],
    queryFn: async () => {
      if (!caseId) return [];

      try {
        const { data, error } = await supabase
          .from("witnesses")
          .select("*")
          .eq("case_id", caseId);
        if (error) throw error;
        return data;
      } catch (error) {
        showError({
          title: "Failed to load case witnesses",
          message: error.message,
        });
        return [];
      }
    },
  });

  return {
    data,
    isLoading,
  };
}
