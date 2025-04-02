// Dependency imports
import { useQuery } from "@tanstack/react-query";

// Services imports
import { supabase } from "../../services/supabaseClient";

function useCases () {
    return useQuery({
        queryKey: ["cases"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("cases")
                .select("*")
                .order("year", { ascending: false });
            if (error) throw new Error(error.message);
            return data;
        },
    });
};

function useCaseWitnesses (caseId) {
    return useQuery({
        queryKey: ["caseWitnesses", caseId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("witnesses")
                .select("*")
                .eq("case_id", caseId)
                .order("name");
            if (error) throw new Error(error.message);
            return data;
        },
        enabled: !!caseId
    })
}

export { useCases, useCaseWitnesses };