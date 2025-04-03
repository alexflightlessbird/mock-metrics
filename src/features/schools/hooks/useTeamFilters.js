// Dependency imports
import { useMemo } from "react";

function useStudentTeamFilters({ teamId, allStudentTeams }) {
    return useMemo(() => {
        const safeItems = allStudentTeams || [];
        return safeItems.filter((i) => i.team_id === teamId && i.is_active == true);
    }, [teamId, allStudentTeams])
}

function useTournamentTeamFilters({ teamId, allTeamsTournaments }) {
    return useMemo(() => {
        const safeItems = allTeamsTournaments || [];
        return safeItems.filter((i) => i.team_id === teamId);
    }, [teamId, allTeamsTournaments])
}

export { useStudentTeamFilters, useTournamentTeamFilters };
