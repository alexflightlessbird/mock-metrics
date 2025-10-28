import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import useNotifications from "../../../common/hooks/useNotifications";

export function useAddTeam() {
    const { showSuccess, showError } = useNotifications();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ schoolId, name, type, year, caseId }) => {
            const { data, error } = await supabase.from("teams").insert({
                school_id: schoolId,
                name: name.trim(),
                year,
                type,
                case_id: caseId,
            });
            if (error) throw error;
            return data;
        },
        onSuccess: (data, variables) => {
            showSuccess({
                message: "The team has been created",
            });
            queryClient.invalidateQueries(["school-teams", variables.schoolId]);
        },
        onError: (error) => {
            showError({
                title: "Failed to add team",
                message: error.message,
            });
        }
    })
}