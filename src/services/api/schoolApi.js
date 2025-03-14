import { supabase } from "../supabaseClient";

export const fetchSchoolData = async (schoolId) => {
    const { data, error } = await supabase
        .from("schools")
        .select("*")
        .eq("id", schoolId)
        .single();

    return { data, error };
}

export const fetchSchoolTeams = async (schoolId) => {
    const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("school_id", schoolId)
        .order("name");
    return { data, error };
}

export const fetchSchoolTournaments = async (schoolId) => {
    const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .eq("school_id", schoolId)
        .order("year", { ascending: false });
    return { data, error };
}

export const fetchSchoolStudents = async (schoolId) => {
    const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("school_id", schoolId)
        .order("name");
    return { data, error };
}

export const fetchSchoolRole = async (schoolId, userId) => {
    const { data, error } = await supabase
        .from("users_schools")
        .select("role")
        .eq("school_id", schoolId)
        .eq("user_id", userId)
        .single();
    return { data, error };
}

export const fetchSchoolAssignees = async (schoolId) => {
    const { data, error } = await supabase
        .from("users_schools")
        .select("*, users(name, email)")
        .eq("school_id", schoolId);
    return { data, error };
}