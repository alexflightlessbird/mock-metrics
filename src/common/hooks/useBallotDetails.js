import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import useNotifications from "./useNotifications";

export function useBallotDetails(ballotId) {
	const { showSuccess, showError } = useNotifications();
	const queryClient = useQueryClient();

	const { data, isLoading } = useQuery({
		queryKey: ["ballot-details", ballotId],
		queryFn: async () => {
			if (!ballotId) return {};

			try {
				const { data, error } = await supabase
					.from("ballots")
					.select("*, scores(*)")
					.eq("id", ballotId)
					.maybeSingle();
				if (error) throw error;
				return data;
			} catch (error) {
				showError({
					title: "Failed to load ballot details",
					message: error.message,
				});
				return {};
			}
		},
	});

	const addBallotMutation = useMutation({
		mutationFn: async ({ judgeName, roundId }) => {
			const { error } = await supabase.from("ballots").insert({
				judge_name: judgeName,
				round_id: roundId,
			});
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries(["round-ballots", roundId]);
			showSuccess({ message: "Ballot added successfully" });
		},
		onError: (error) => {
			showError({ title: "Failed to add ballot", message: error.message });
		},
	});

	const updateBallotMutation = useMutation({
		mutationFn: async ({ ballotId, updates }) => {
			const { error } = await supabase
				.from("ballots")
				.update(updates)
				.eq("id", ballotId);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries(["ballot-details", ballotId]);
			showSuccess({ message: "Ballot updated successfully" });
		},
		onError: (error) => {
			showError({ title: "Failed to update ballot", message: error.message });
		},
	});

	const addScoresMutation = useMutation({
		mutationFn: async ({ ballotId, scores }) => {
			const { error } = await supabase.from("scores").insert(
				scores.map((score) => ({
					score_type: score.type,
					score_value: score.value,
					ballot_id: ballotId,
				}))
			);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries(["ballot-details", ballotId]);
			showSuccess({ message: "Scores added successfully" });
		},
		onError: (error) => {
			showError({ title: "Failed to add scores", message: error.message });
		},
	});

	const updateScoresMutation = useMutation({
		mutationFn: async ({ scoreId, scoreValue }) => {
			const { error } = await supabase
				.from("scores")
				.update({ score_value: scoreValue })
				.eq("id", scoreId);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries(["ballot-details", ballotId]);
			showSuccess({ message: "Scores updated successfully" });
		},
		onError: (error) => {
			showError({ title: "Failed to update scores", message: error.message });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: async ({ ballotId, roundId }) => {
			const { error } = await supabase
				.from("ballots")
				.delete()
				.eq("id", ballotId);
			if (error) throw error;
		},
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries(
				["round-ballots", variables.roundId],
				["ballot-details", variables.ballotId]
			);
			showSuccess({ message: "Ballot deleted successfully" });
		},
		onError: (error) => {
			showError({ message: error.message, title: "Failed to delete ballot" });
		},
	});

	return {
		data,
		isLoading,
		addBallot: addBallotMutation.mutateAsync,
		updateBallot: updateBallotMutation.mutateAsync,
		deleteBallot: deleteMutation.mutateAsync,
		addScores: addScoresMutation.mutateAsync,
		updateScores: updateScoresMutation.mutateAsync,
	};
}
