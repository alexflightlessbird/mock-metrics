import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";

export function useUserDetails(userId) {
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
        console.log(error);
        return {};
      }
    },
  });

  return {
    data,
    isLoading,
  };
}
