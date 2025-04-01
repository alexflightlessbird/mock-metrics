import { useMemo } from "react";

export function useTournamentFilters({ tournamentId, allTeamsTournaments }) {
    return useMemo(() => {
        const safeItems = allTeamsTournaments || [];
        return safeItems.filter((i) => i.tournament_id === tournamentId);
    }, [tournamentId, allTeamsTournaments])
}