import { supabase } from "../supabaseClient";

async function fetchTeamData(teamId) {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("id", teamId)
    .single();

  return { data, error };
}

async function fetchTeamTournaments(teamId) {
  const { data, error } = await supabase
    .from("teams_tournaments")
    .select("*, tournaments(*)")
    .eq("team_id", teamId);

  return { data, error };
}

async function fetchTeamStudents(teamId) {
  const { data, error } = await supabase
    .from("student_teams")
    .select("*, students(*)")
    .eq("team_id", teamId);

  return { data, error };
}

async function fetchTeamRounds(teamId) {
  const { data, error } = await supabase
    .from("rounds")
    .select("*")
    .eq("team_id", teamId);

  return { data, error };
}

async function fetchTeamBallots(teamId) {
  const { data, error } = await supabase
    .from("rounds")
    .select("*, ballots(*)")
    .eq("team_id", teamId);

  return { data, error };
}

async function fetchTeamScores(teamId) {
  const { data, error } = await supabase
    .from("rounds")
    .select("*, ballots(*, scores(*))")
    .eq("team_id", teamId);

  return { data, error };
}

async function fetchTeamRoleRounds(teamId) {
  const { data, error } = await supabase
    .from("rounds")
    .select("*, role_rounds(*)")
    .eq("team_id", teamId);

  return { data, error };
}

async function fetchTeamWitnessRounds(teamId) {
  const { data, error } = await supabase
    .from("rounds")
    .select("*, witness_rounds(*), witnesses(*)")
    .eq("team_id", teamId);

  return { data, error };
}

export {
  fetchTeamData,
  fetchTeamTournaments,
  fetchTeamStudents,
  fetchTeamRounds,
  fetchTeamBallots,
  fetchTeamScores,
  fetchTeamRoleRounds,
  fetchTeamWitnessRounds,
};
