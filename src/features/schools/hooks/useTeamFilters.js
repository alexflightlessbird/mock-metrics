import { useMemo } from "react";

export function useStudentTeamFilters({ teamId, allStudentTeams }) {
    console.log(teamId, allStudentTeams);
    return useMemo(() => {
        const safeItems = allStudentTeams || [];
        return safeItems.filter((i) => i.team_id === teamId && i.is_active == true);
    }, [teamId, allStudentTeams])
}

export function useTournamentTeamFilters({ teamId, allTeamsTournaments }) {
    return useMemo(() => {
        const safeItems = allTeamsTournaments || [];
        return safeItems.filter((i) => i.team_id === teamId);
    }, [teamId, allTeamsTournaments])
}