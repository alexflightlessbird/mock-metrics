import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import useNotifications from "../../../common/hooks/useNotifications";

export function useUserAssignments(userId) {
    const { showError } = useNotifications();

    const { data: assignments, isLoading } = useQuery({
        queryKey: ["user-assignments", userId],
        queryFn: async () => {
            if (!userId) return [];

            try {
                const { data, error } = await supabase
                    .from("users_schools")
                    .select("school_id, role, schools:school_id (id, name, short_name)")
                    .eq("user_id", userId);
                if (error) throw error;
                if (data?.length === 0) return [];
                return data;
            } catch (error) {
                showError({
                    title: "Failed to load assignments",
                    message: error.message
                });
            }
        }
    })

    return {
        assignments,
        isLoading
    }
}