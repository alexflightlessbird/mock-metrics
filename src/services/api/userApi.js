import { supabase } from "./supabaseClient";

async function fetchUserSchools(userId) {
  const { data, error } = await supabase
    .from("schools_users")
    .select("schools(*)")
    .eq("user_id", userId);

  return { data, error };
}

export { fetchUserSchools };
