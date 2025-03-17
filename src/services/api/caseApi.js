import { supabase } from "../supabaseClient";

async function fetchCases() {
  const { data, error } = await supabase
    .from("casess")
    .select("*")
    .order("year", { ascending: false });

  return { data, error };
}

async function fetchCaseData(caseId) {
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("id", caseId)
    .single();

  return { data, error };
}

async function fetchCaseTournaments(caseId, schoolId) {
  const { data, error } = await supabase
    .from("tournaments")
    .select("*")
    .eq("case_id", caseId)
    .eq("school_id", schoolId)
    .order("year", { ascending: false });

  return { data, error };
}

async function fetchCaseWitnesses(caseId) {
  const { data, error } = await supabase
    .from("witnesses")
    .select("*")
    .eq("case_id", caseId)
    .order("name");

  return { data, error };
}

export { fetchCases, fetchCaseData, fetchCaseTournaments, fetchCaseWitnesses };
