import { supabase } from "../supabaseClient";

export const fetchCases = async () => {
    const { data, error } = await supabase
        .from("cases")
        .select("*")
        .order("year", { ascending: false });
    return { data, error };
}