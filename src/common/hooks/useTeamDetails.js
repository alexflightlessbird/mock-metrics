import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import useNotifications from "./useNotifications";

export function useTeamDetails(teamId, schoolId) {
  const { showSuccess, showError } = useNotifications();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["team-details", teamId],
    queryFn: async () => {
      if (!teamId) return {};

      try {
        const { data, error } = await supabase
          .from("teams")
          .select("*")
          .eq("id", teamId)
          .maybeSingle();
        if (error) throw error;
        return data;
      } catch (error) {
        showError({
          title: "Failed to load team details",
          message: error.message,
        });
        return {};
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updates) => {
      if (!updates || Object.keys(updates).length === 0)
        return { noUpdates: true };
      const { error } = await supabase
        .from("teams")
        .update(updates)
        .eq("id", teamId);
      if (error) throw error;

      return { noUpdates: false };
    },
    onSuccess: (result) => {
      if (result.noUpdates) {
        showSuccess({ message: "No changes to update", title: "No changes" });
      } else {
        queryClient.invalidateQueries(["team-details", teamId]);
        showSuccess({ message: "Team updated successfully" });
      }
    },
    onError: (error) => {
      showError({
        title: "Failed to update team",
        message: error.message,
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ teamId, schoolId }) => {
      const { error } = await supabase
        .from("teams")
        .delete()
        .eq("id", teamId);
      if (error) throw error;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["school-teams", variables.schoolId]);
      showSuccess({ message: "Team deleted successfully" });
    },
    onError: (error) => {
      showError({ message: error.message, title: "Failed to delete team" });
    },
  });

  return {
    data,
    isLoading,
    deleteTeam: deleteMutation.mutateAsync,
    updateTeam: updateMutation.mutateAsync,
  };
}

export function useTeamStudents(teamId) {
  const { showError, showSuccess } = useNotifications();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["team-students", teamId],
    queryFn: async () => {
      if (!teamId) return [];

      try {
        const { data, error } = await supabase
          .from("students_teams")
          .select("*, students(*)")
          .eq("team_id", teamId)
          .eq("is_active", true);
        if (error) throw error;
        return data;
      } catch (error) {
        showError({
          title: "Failed to load team students",
          message: error.message,
        });
        return [];
      }
    },
  });

  const removeMutation = useMutation({
    mutationFn: async ({ studentId, teamId }) => {
      if (!studentId || !teamId) return;

      const { error } = await supabase
        .from("students_teams")
        .update({ is_active: false })
        .eq("student_id", studentId)
        .eq("team_id", teamId);
      if (error) throw error;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["team-students", variables.teamId]);
      showSuccess({ message: "Student removed from team successfully" });
    },
    onError: (error) => {
      showError({ message: error.message, title: "Failed to remove student from team" });
    },
  });

  const addMutation = useMutation({
    mutationFn: async ({ studentId, teamId }) => {
      if (!studentId || !teamId) return;

      const { data: existing, error: fetchError } = await supabase
        .from("students_teams")
        .select("*")
        .eq("student_id", studentId)
        .eq("team_id", teamId)
        .maybeSingle();
      if (fetchError) throw fetchError;

      const { data: existingActive, error: fetchActiveError } = await supabase
        .from("students_teams")
        .select("*")
        .eq("student_id", studentId)
        .eq("is_active", true)
        .maybeSingle();
      if (fetchActiveError) throw fetchActiveError;

      if (existingActive) {
        const { error: removeExistingError } = await supabase
          .from("students_teams")
          .update({ is_active: false })
          .eq("student_id", studentId)
          .eq("team_id", existingActive.team_id);
        if (removeExistingError) throw removeExistingError;

        queryClient.invalidateQueries(["team-students", existingActive.team_id]);
      }

      if (existing) {
        const { error: updateError } = await supabase
          .from("students_teams")
          .update({ is_active: true })
          .eq("student_id", studentId)
          .eq("team_id", teamId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("students_teams")
          .insert({ student_id: studentId, team_id: teamId, is_active: true });
        if (insertError) throw insertError;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["team-students", variables.teamId]);
      showSuccess({ message: "Student added to team successfully" });
    },
    onError: (error) => {
      showError({ message: error.message, title: "Failed to add student to team" });
    },
  });

  return {
    data,
    isLoading,
    removeStudentFromTeam: removeMutation.mutateAsync,
    addStudentToTeam: addMutation.mutateAsync,
  };
}