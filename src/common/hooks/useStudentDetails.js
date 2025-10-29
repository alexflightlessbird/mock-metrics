import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import useNotifications from "./useNotifications";

export function useStudentDetails(studentId) {
    const { showError } = useNotifications();

    const { data, isLoading } = useQuery({
        queryKey: ["student-details", studentId],
        queryFn: async () => {
            if (!studentId) return {};

            try {
                const { data, error } = await supabase
                    .from("students")
                    .select("*, students_teams(*, teams(*))")
                    .eq("id", studentId)
                    .maybeSingle();
                if (error) throw error;
                return data;
            } catch (error) {
                showError({
                    title: "Failed to load student details",
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