// Dependency imports
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Services imports
import { supabase } from "../../services/supabaseClient";

function useSchools (userId) {
    return useQuery({
        queryKey: ["schools", userId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("users_schools")
                .select("*, schools(*)")
                .eq("user_id", userId)
                .order("schools(name)");
            if (error) throw new Error(error.message);
            return data;
        },
        enabled: !!userId,
    });
};

function useSchoolMutations () {
    const queryClient = useQueryClient();

    async function updateSchool ({ schoolId, updates }) {
        const { data, error } = await supabase
            .from("schools")
            .update(updates)
            .eq("id", schoolId);
        if (error) throw new Error(error.message);
        queryClient.invalidateQueries(["schools"]);
        return data;
    };

    return { updateSchool };
}

export { useSchools, useSchoolMutations }