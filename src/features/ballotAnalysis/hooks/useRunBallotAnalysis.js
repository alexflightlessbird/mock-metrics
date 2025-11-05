import { useState } from "react";
import { combineBallotsCalculations, fullTournamentCalculations } from "../utils/calculations";
import tournamentTeamScores from "../utils/tournamentTeamScores";
import overallScoresCalculator from "../utils/overallScores";
import logger from "../../../common/utils/logger";

export default function useRunBallotAnalysis() {
    const [analysisRunning, setAnalysisRunning] = useState(false);
    const [neededTournamentData, setNeededTournamentData] = useState([]);
    const [calculatedTeamScores, setCalculatedTeamScores] = useState([]);
    const [allTeamScores, setAllTeamScores] = useState([]);
    const [overallScores, setOverallScores] = useState([]);

    const runAnalysis = async (tournaments, selectedTournamentIds, selectedTeamIds) => {
        setAnalysisRunning(true);

        const selectedTournaments = tournaments.filter(t => selectedTournamentIds.includes(t.id));

        const currentTournamentData = selectedTournaments.map(t => ({
            area: t.area,
            case_id: t.case_id,
            id: t.id,
            name: t.name,
            type: t.type,
            year: t.year,
            teams: t.teams_tournaments
                .filter(tt => selectedTeamIds[t.id]?.includes(tt.team_id))
                .map(tt => ({
                    id: tt.team_id,
                    name: tt.teams.name,
                    type: tt.teams.type,
                    year: tt.teams.year,
                    rounds: t.rounds
                        .filter(r => r.team_id === tt.team_id)
                        .sort((a, b) => a.round_number - b.round_number)
                        .map(r => ({
                            id: r.id,
                            round_number: r.round_number,
                            side: r.side,
                            witness_rounds: r.witness_rounds.map(wr => ({
                                role_type: wr.role_type,
                                witness: {
                                    id: wr.witnesses.id,
                                    name: wr.witnesses.name,
                                    side: wr.witnesses.side,
                                    type: wr.witnesses.type,
                                },
                            })),
                            role_rounds: r.role_rounds.map(rr => ({
                                role_type: rr.role_type,
                                student: {
                                    id: rr.students.id,
                                    name: rr.students.name,
                                },
                            })),
                            calculations: combineBallotsCalculations({
                                side: r.side,
                                ballots: r.ballots,
                                role_rounds: r.role_rounds,
                            }),
                            ballots: r.ballots.length,
                            ballots_with_scores: r.ballots.map(b => ({
                                id: b.id,
                                scores: b.scores.map(s => ({
                                    score_type: s.score_type,
                                    score_value: s.score_value,
                                    score_weight: s.weight,
                                })),
                            })),
                        })),
                })),
        }));

        const tournamentTeamScoresCalc = currentTournamentData.map(t => ({
            tournamentId: t.id,
            tournamentName: t.name,
            teamScores: t.teams.map(team => ({
                teamId: team.id,
                teamName: team.name,
                scores: tournamentTeamScores({ team }),
            })),
        }));

        const tournamentTeamsAll = tournamentTeamScoresCalc.map(t => ({
            tournamentId: t.tournamentId,
            calculations: fullTournamentCalculations({ tournament: t }),
        }));

        const overallScoresData = overallScoresCalculator({
            tournaments: tournamentTeamsAll,
        });

        setNeededTournamentData(currentTournamentData);
        setCalculatedTeamScores(tournamentTeamScoresCalc);
        setAllTeamScores(tournamentTeamsAll);
        setOverallScores(overallScoresData);

        setTimeout(() => {
            setAnalysisRunning(false);

            logger.info("BA Attorneys", overallScoresData.attorneys);
            logger.info("BA Witnesses", overallScoresData.witnesses);
        }, 3000);
    }

    return { runAnalysis, analysisRunning, neededTournamentData, calculatedTeamScores, allTeamScores, overallScores };
}