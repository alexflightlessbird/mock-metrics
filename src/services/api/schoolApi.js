import { supabase } from "../supabaseClient";

async function fetchSchools() {
  const { data, error } = await supabase
    .from("schools")
    .select("*")
    .order("name");

  return { data, error };
}

async function fetchSchoolData(schoolId) {
  const { data, error } = await supabase
    .from("schools")
    .select("*")
    .eq("id", schoolId)
    .single();

  return { data, error };
}

async function fetchSchoolTeams(schoolId) {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("school_id", schoolId)
    .order("name");

  return { data, error };
}

async function fetchSchoolTournaments(schoolId) {
  const { data, error } = await supabase
    .from("tournaments")
    .select("*")
    .eq("school_id", schoolId)
    .order("year", { ascending: false });

  return { data, error };
}

async function fetchSchoolStudents(schoolId) {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("school_id", schoolId)
    .order("name");

  return { data, error };
}

async function fetchSchoolRole(schoolId, userId) {
  const { data, error } = await supabase
    .from("users_schools")
    .select("role")
    .eq("school_id", schoolId)
    .eq("user_id", userId)
    .single();

  return { data, error };
}

async function fetchSchoolAssignees(schoolId) {
  const { data, error } = await supabase
    .from("users_schools")
    .select("*, users(name, email)")
    .eq("school_id", schoolId);

  return { data, error };
}

async function fetchSchoolRounds(schoolId) {
  const { data, error } = await supabase
    .from("tournaments")
    .select("*, rounds(*)")
    .eq("school_id", schoolId);

  return { data, error };
}

async function fetchSchoolBallots(schoolId) {
  const { data, error } = await supabase
    .from("tournaments")
    .select("*, rounds(*, ballots(*))")
    .eq("school_id", schoolId);

  return { data, error };
}

async function fetchSchoolScores(schoolId) {
  const { data, error } = await supabase
    .from("tournaments")
    .select("*, rounds(*, ballots(*, scores(*)))")
    .eq("school_id", schoolId);

  return { data, error };
}

async function fetchSchoolRoleRounds(schoolId) {
  const { data, error } = await supabase
    .from("tournaments")
    .select("*, rounds(*, role_rounds(*))")
    .eq("school_id", schoolId);

  return { data, error };
}

async function fetchSchoolWitnessRounds(schoolId) {
  const { data, error } = await supabase
    .from("tournaments")
    .select("*, rounds(*, witness_rounds(*), witnesses(*))")
    .eq("school_id", schoolId);

  return { data, error };
}

export {
  fetchSchools,
  fetchSchoolData,
  fetchSchoolTeams,
  fetchSchoolTournaments,
  fetchSchoolStudents,
  fetchSchoolRole,
  fetchSchoolAssignees,
  fetchSchoolRounds,
  fetchSchoolBallots,
  fetchSchoolScores,
  fetchSchoolRoleRounds,
  fetchSchoolWitnessRounds,
};
