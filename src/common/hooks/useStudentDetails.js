import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import useNotifications from "./useNotifications";

export function useStudentDetails(studentId) {
    const { showError, showSuccess } = useNotifications();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["student-details", studentId],
        queryFn: async () => {
            if (!studentId) return {};

            try {
                const { data, error } = await supabase
                    .from("students")
                    .select("*, students_teams(*, teams(*))")
                    .eq("id", studentId)
                    .maybeSingle();
                if (error) throw error;
                return data;
            } catch (error) {
                showError({
                    title: "Failed to load student details",
                    message: error.message,
                });
                return {};
            }
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ updates, other }) => {
            if (!updates || Object.keys(updates).length === 0) {
                return { otherUpdates: other || false, noUpdates: true };
            }
            const { error } = await supabase
                .from("students")
                .update(updates)
                .eq("id", studentId);
            if (error) throw error;

            return { noUpdates: false };
        },
        onSuccess: (result) => {
            if (result.noUpdates) {
                if (!result.otherUpdates) {
                    showSuccess({ message: "No changes to update", title: "No changes" });
                }
            } else {
                queryClient.invalidateQueries(["student-details", studentId]);
                showSuccess({ message: "Student updated successfully" });
            }
        },
        onError: (error) => {
            showError({
                title: "Failed to update student",
                message: error.message,
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async ({ studentId, schoolId }) => {
            const { error } = await supabase
                .from("students")
                .delete()
                .eq("id", studentId);
            if (error) throw error;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(["school-students", variables.schoolId]);
            showSuccess({ message: "Student deleted successfully" });
        },
        onError: (error) => {
            showError({
                title: "Failed to delete student",
                message: error.message,
            });
        }
    });

    return {
        data,
        isLoading,
        deleteStudent: deleteMutation.mutateAsync,
        updateStudent: updateMutation.mutateAsync,
    };
}

export function useStudentTeams(studentId) {
    const { showError, showSuccess } = useNotifications();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["student-teams", studentId],
        queryFn: async () => {
            if (!studentId) return [];

            try {
                const { data, error } = await supabase
                    .from("students_teams")
                    .select("*, teams(*)")
                    .eq("student_id", studentId);
                if (error) throw error;
                return data;
            } catch (error) {
                showError({
                    title: "Failed to load student teams",
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
            queryClient.invalidateQueries(["student-teams", variables.studentId]);
            queryClient.invalidateQueries(["team-students", variables.teamId]);
            showSuccess({ message: "Team removed from student successfully" });
        },
        onError: (error) => {
            showError({
                title: "Failed to remove team from student",
                message: error.message,
            });
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

                queryClient.invalidateQueries(["student-teams", studentId]);
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
            queryClient.invalidateQueries(["student-teams", variables.studentId]);
            queryClient.invalidateQueries(["team-students", variables.teamId]);
            showSuccess({ message: "Team added to student successfully" });
        },
        onError: (error) => {
            showError({
                title: "Failed to add team to student",
                message: error.message,
            });
        },
    });

    return {
        data,
        isLoading,
        removeTeamFromStudent: removeMutation.mutateAsync,
        addTeamToStudent: addMutation.mutateAsync,
    };
}