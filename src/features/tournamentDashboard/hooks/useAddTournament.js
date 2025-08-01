import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import useNotifications from "../../../common/hooks/useNotifications";

export function useAddTournament() {
	const { showSuccess, showError } = useNotifications();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ schoolId, name, year, type, area, caseId }) => {
			const { data, error } = await supabase.from("tournaments").insert({
				school_id: schoolId,
				name: name.trim(),
				year,
				type,
				area,
				case_id: caseId,
			});
			if (error) throw error;
			return data;
		},
		onSuccess: (data, variables) => {
			showSuccess({
				message: "The tournament has been created",
			});
			queryClient.invalidateQueries(["school-tournaments", variables.schoolId]);
		},
		onError: (error) => {
			showError({
				title: "Failed to add tournament",
				message: error.message,
			});
		},
	});
}
