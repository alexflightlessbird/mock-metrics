import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import useNotifications from "../../../common/hooks/useNotifications";

export function useArchiveTournament() {
	const { showSuccess, showError } = useNotifications();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ tournamentId, schoolId }) => {
			const { data, error } = await supabase
				.from("tournaments")
				.update({ is_active: false })
				.eq("id", tournamentId)
				.eq("school_id", schoolId);
			if (error) throw error;
			return data;
		},
		onSuccess: (data, variables) => {
			showSuccess({
				message: "The tournament has been archived",
			});
			queryClient.invalidateQueries(["school-tournaments", variables.schoolId]);
		},
		onError: (error) => {
			showError({
				title: "Failed to archive tournament",
				message: error.message,
			});
		},
	});
}

export function useUnarchiveTournament() {
	const { showSuccess, showError } = useNotifications();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ tournamentId, schoolId }) => {
			const { data, error } = await supabase
				.from("tournaments")
				.update({ is_active: true })
				.eq("id", tournamentId)
				.eq("school_id", schoolId);
			if (error) throw error;
			return data;
		},
		onSuccess: (data, variables) => {
			showSuccess({
				message: "The tournament has been unarchived",
			});
			queryClient.invalidateQueries(["school-tournaments", variables.schoolId]);
		},
		onError: (error) => {
			showError({
				title: "Failed to unarchive tournament",
				message: error.message,
			});
		},
	});
}
