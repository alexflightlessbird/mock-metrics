// Dependency imports
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Services imports
import { supabase } from "../../services/supabaseClient";

function useRoundWitnesses(roundId) {
  return useQuery({
    queryKey: ["roundWitnesses", roundId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("witness_rounds")
        .select("*, witnesses(*), rounds(*)")
        .eq("round_id", roundId)
        .order("role_type");
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!roundId,
  });
}

function useRoundRoles(roundId) {
  return useQuery({
    queryKey: ["roundRoles", roundId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("role_rounds")
        .select("*, students(*), rounds(*)")
        .eq("round_id", roundId)
        .order("role_type");
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!roundId,
  });
}

function useRoundDataMutations() {
  const queryClient = useQueryClient();

  async function deleteRound({ roundId, tournamentId, schoolId }) {
    const { error } = await supabase
      .from("rounds")
      .delete()
      .eq("id", roundId)
      .eq("tournament_id", tournamentId);
    if (error) throw new Error(error.message);
    queryClient.invalidateQueries(["schoolRounds", schoolId]);
    return;
  }

  return { deleteRound };
}

export { useRoundWitnesses, useRoundRoles, useRoundDataMutations };
