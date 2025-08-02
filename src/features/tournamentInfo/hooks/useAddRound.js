import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import useNotifications from "../../../common/hooks/useNotifications";

export function useAddRound() {
  const { showSuccess, showError } = useNotifications();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tournamentId,
      teamId,
      roundNumber,
      side,
      witnessRoundData,
      roleRoundData,
    }) => {
      const { data, error } = await supabase.rpc(
        "create_round_with_witnesses",
        {
          tournament_id: tournamentId,
          team_id: teamId,
          round_number: roundNumber,
          side: side,
          witness_data: witnessRoundData,
          role_data: roleRoundData,
        }
      );
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      showSuccess({
        message: "The round has been created",
      });
      queryClient.invalidateQueries([
        "tournament-team-rounds",
        variables.tournamentId,
        variables.teamId,
      ]);
    },
    onError: (error) => {
      showError({
        title: "Failed to add round",
        message: error.message,
      });
    },
  });
}
