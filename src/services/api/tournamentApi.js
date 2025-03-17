import { supabase } from "../supabaseClient";

async function fetchTournamentData(tournamentId) {
  const { data, error } = await supabase
    .from("tournaments")
    .select("*")
    .eq("id", tournamentId)
    .single();

  return { data, error };
}

async function fetchTournamentTeams(tournamentId) {
  const { data, error } = await supabase
    .from("teams_tournaments")
    .select("*, teams(*)")
    .eq("tournament_id", tournamentId);

  return { data, error };
}

async function fetchTournamentRounds(tournamentId) {
  const { data, error } = await supabase
    .from("rounds")
    .select("*")
    .eq("tournament_id", tournamentId);

  return { data, error };
}

async function fetchTournamentBallots(tournamentId) {
  const { data, error } = await supabase
    .from("rounds")
    .select("*, ballots(*)")
    .eq("tournament_id", tournamentId);

  return { data, error };
}

async function fetchTournamentScores(tournamentId) {
  const { data, error } = await supabase
    .from("rounds")
    .select("*, ballots(*, scores(*))")
    .eq("tournament_id", tournamentId);

  return { data, error };
}

async function fetchTournamentRoleRounds(tournamentId) {
  const { data, error } = await supabase
    .from("rounds")
    .select("*, role_rounds(*)")
    .eq("tournament_id", tournamentId);

  return { data, error };
}

async function fetchTournamentWitnessRounds(tournamentId) {
  const { data, error } = await supabase
    .from("rounds")
    .select("*, witness_rounds(*), witnesses(*)")
    .eq("tournament_id", tournamentId);

  return { data, error };
}

export {
  fetchTournamentData,
  fetchTournamentTeams,
  fetchTournamentRounds,
  fetchTournamentBallots,
  fetchTournamentScores,
  fetchTournamentRoleRounds,
  fetchTournamentWitnessRounds,
};
