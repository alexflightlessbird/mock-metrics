import { supabase } from "../supabaseClient";

async function fetchStudentData(studentId) {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", studentId)
    .single();

  return { data, error };
}

async function fetchStudentTeams(studentId) {
  const { data, error } = await supabase
    .from("student_teams")
    .select("*, teams(*)")
    .eq("student_id", studentId);

  return { data, error };
}

async function fetchStudentTournaments(studentId) {
  const { data, error } = await supabase
    .from("role_rounds")
    .select("*, rounds(*, tournaments(*))")
    .eq("student_id", studentId);

  return { data, error };
}

async function fetchStudentRounds(studentId) {
  const { data, error } = await supabase
    .from("role_rounds")
    .select("*, rounds(*)")
    .eq("student_id", studentId);

  return { data, error };
}

async function fetchStudentBallots(studentId) {
  const { data, error } = await supabase
    .from("role_rounds")
    .select("*, rounds(*, ballots(*))")
    .eq("student_id", studentId);

  return { data, error };
}

async function fetchStudentScores(studentId) {
  const { data, error } = await supabase
    .from("role_rounds")
    .select("*, rounds(*, ballots(*, scores(*)))")
    .eq("role_rounds.role_type", "scores.score_type")
    .eq("student_id", studentId);

  return { data, error };
}

async function fetchStudentRoleRounds(studentId) {
  const { data, error } = await supabase
    .from("role_rounds")
    .select("*")
    .eq("student_id", studentId);

  return { data, error };
}

async function fetchStudentWitnessRounds(studentId) {
  const { data, error } = await supabase
    .from("role_rounds")
    .select("*, rounds(*, witness_rounds(*), witnesses(*)")
    .eq("student_id", studentId);

  return { data, error };
}

export {
  fetchStudentData,
  fetchStudentTeams,
  fetchStudentTournaments,
  fetchStudentRounds,
  fetchStudentBallots,
  fetchStudentScores,
  fetchStudentRoleRounds,
  fetchStudentWitnessRounds,
};
