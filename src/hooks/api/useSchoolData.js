// Dependency imports
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Services imports
import { supabase } from "../../services/supabaseClient";

function useSchoolTeams (schoolId) {
    return useQuery({
        queryKey: ["schoolTeams", schoolId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("teams")
                .select("*")
                .eq("school_id", schoolId)
                .order("name");
            if (error) throw new Error(error.message);
            return data;
        },
        enabled: !!schoolId,
    });
};

function useSchoolStudents (schoolId) {
    return useQuery({
        queryKey: ["schoolStudents", schoolId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("students")
                .select("*")
                .eq("school_id", schoolId)
                .order("name");
            if (error) throw new Error(error.message);
            return data;
        },
        enabled: !!schoolId,
    });
};

function useSchoolTournaments (schoolId) {
    return useQuery({
        queryKey: ["schoolTournaments", schoolId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("tournaments")
                .select("*")
                .eq("school_id", schoolId)
                .order("name");
            if (error) throw new Error(error.message);
            return data;
        },
        enabled: !!schoolId,
    });
};

function useSchoolUsers (schoolId, enabled) {
    return useQuery({
        queryKey: ["schoolUsers", schoolId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("users_schools")
                .select("*, users(*)")
                .eq("school_id", schoolId)
                .order("users(name)");
            if (error) throw new Error(error.message);
            return data;
        },
        enabled: enabled !== undefined ? enabled : !!schoolId,
    });
};

function useSchoolStudentTeams (schoolId) {
    return useQuery({
        queryKey: ["studentTeams", schoolId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("students_teams")
                .select("*, teams(*), students(*)")
                .eq("teams.school_id", schoolId);
            if (error) throw new Error(error.message);
            return data;
        },
        enabled: !!schoolId,
    })
}

function useSchoolTeamsTournaments (schoolId) {
    return useQuery({
        queryKey: ["teamsTournaments", schoolId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("teams_tournaments")
                .select("*, teams(*), tournaments(*)")
                .eq("teams.school_id", schoolId);
            if (error) throw new Error(error.message);
            return data;
        },
        enabled: !!schoolId,
    })
}

function useSchoolDataMutations () {
    const queryClient = useQueryClient();

    async function updateUserRole ({ userId, schoolId, role }) {
        const { data, error } = await supabase
            .from("users_schools")
            .update({ role })
            .eq("user_id", userId)
            .eq("school_id", schoolId);
        if (error) throw new Error(error.message);
        queryClient.invalidateQueries(["schools"]);
        queryClient.invalidateQueries(["schoolUsers", schoolId]);
        return data;
    }

    async function removeUserFromSchool ({ userId, schoolId }) {
        const { data, error } = await supabase
            .from("users_schools")
            .delete()
            .eq("user_id", userId)
            .eq("school_id", schoolId);
        if (error) throw new Error(error.message);
        queryClient.invalidateQueries(["schools"]);
        queryClient.invalidateQueries(["schoolUsers", schoolId]);
        return data;
    }

    async function updateStudent ({ studentId, name, is_active, newTeamId, originalTeamId, schoolId }) {
        if (name !== undefined || is_active !== undefined) {
            const { error: studentError } = await supabase
                .from("students")
                .update({ name, is_active })
                .eq("id", studentId);
            if (studentError) throw new Error(studentError.message);
        }

        if (newTeamId !== undefined) {
            if (originalTeamId && newTeamId !== originalTeamId) {
                const { error: deactivateError } = await supabase
                    .from("students_teams")
                    .update({ is_active: false })
                    .eq("student_id", studentId)
                    .eq("team_id", originalTeamId);
                if (deactivateError) throw new Error(deactivateError.message);
            }

            if (newTeamId) {
                const { data: existingRelationship, error: lookupError } = await supabase
                    .from("students_teams")
                    .select("*")
                    .eq("student_id", studentId)
                    .eq("team_id", newTeamId)
                    .maybeSingle();
                if (lookupError) throw new Error(lookupError.message);

                if (existingRelationship) {
                    const { error: updateError } = await supabase
                        .from("students_teams")
                        .update({ is_active: true })
                        .eq("student_id", studentId)
                        .eq("team_id", newTeamId);
                    if (updateError) throw new Error(updateError.message);
                } else {
                    const { error: insertError } = await supabase
                        .from("students_teams")
                        .insert([{
                            student_id: studentId,
                            team_id: newTeamId,
                            is_active: true
                        }]);
                    if (insertError) throw new Error(insertError.message);
                }
            }
        }

        queryClient.invalidateQueries(["schoolStudents", schoolId]);
        queryClient.invalidateQueries(["studentTeams", schoolId]);
    }

    async function updateTeam ({ teamId, schoolId, is_active, type, name, year, caseId }) {
        const { data, error } = await supabase
            .from("teams")
            .update({ is_active, type, name, year, case_id: caseId })
            .eq("id", teamId)
            .eq("school_id", schoolId);
        if (error) throw new Error(error.message);
        queryClient.invalidateQueries(["schoolTeams", schoolId]);
        return data;
    }

    async function updateTournament ({ tournamentId, schoolId, year, type, name, area, is_active, caseId }) {
        const { data, error } = await supabase
            .from("tournaments")
            .update({ name, type, year, area, is_active, case_id: caseId })
            .eq("id", tournamentId)
            .eq("school_id", schoolId);
        if (error) throw new Error(error.message);
        queryClient.invalidateQueries(["schoolTournaments", schoolId]);
        return data;
    }

    async function removeTeamFromTournament ({ tournamentId, teamId, schoolId }) {
        const { data, error } = await supabase
            .from("teams_tournaments")
            .delete()
            .eq("team_id", teamId)
            .eq("tournament_id", tournamentId);
        if (error) throw new Error(error.message);
        queryClient.invalidateQueries(["teamsTournaments", schoolId]);
        return data;
    }

    async function addTeamToTournament ({ tournamentId, teamId, schoolId }) {
        const { data, error } = await supabase
            .from("teams_tournaments")
            .insert([{ team_id: teamId, tournament_id: tournamentId }]);
        if (error) throw new Error(error.message);
        queryClient.invalidateQueries(["teamsTournaments", schoolId]);
        return data;
    }

    return { updateUserRole, removeUserFromSchool, updateStudent, updateTeam, updateTournament, removeTeamFromTournament, addTeamToTournament };
}

export { useSchoolTeams, useSchoolStudents, useSchoolTournaments, useSchoolUsers, useSchoolStudentTeams, useSchoolTeamsTournaments, useSchoolDataMutations };
