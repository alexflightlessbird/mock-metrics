import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";

export function useStudentPerformanceHistory(studentId) {
  return useQuery({
    queryKey: ["student-performance-history", studentId],
    enabled: Boolean(studentId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("role_rounds")
        .select(
          "role_type, rounds!inner(id, round_number, side, tournament_id, tournaments!inner(id, name, start_date, cases(type)), role_rounds(role_type, student_id), ballots(id, scores(score_type, score_value, weight)), witness_rounds(role_type, witnesses(id, name, type, side)))",
        )
        .eq("student_id", studentId);

      if (error) throw error;
      return data;
    },
  });
}
