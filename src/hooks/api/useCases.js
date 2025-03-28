import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../services/supabaseClient";

export const useCases = () => {
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

export const useCaseWitnesses = (caseId) => {
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