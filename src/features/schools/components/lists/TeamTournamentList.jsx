import List from "../../../../common/components/List";
import { Link } from "react-router-dom";
import { Flex, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { DeleteIcon } from "../../../../common/components/ActionIcons";
import { ROLES } from "../../../../utils/constants";
import { useSchoolDataMutations } from "../../../../hooks/api/useSchoolData";

export default function TeamTournamentList({ tournaments, schoolRole }) {
    const { removeTeamFromTournament } = useSchoolDataMutations();

    const removeTournamentModal = (tournament) => {
        modals.openConfirmModal({
            title: `Remove Tournament: ${tournament.tournaments.name}`,
            centered: true,
            children: (
                <Text>
                    Are you sure you want to remove {tournament.tournaments.name} from {tournament.teams.name}?<br /><br />Removing the tournament will remove all data (including ballots) associated between this team and this tournament. This action is not reversible and data cannot be recovered.
                </Text>
            ),
            labels: { confirm: "Remove", cancel: "Cancel" },
            onConfirm: async () => {
                try {
                    await removeTeamFromTournament({
                        teamId: tournament.team_id,
                        tournamentId: tournament.tournament_id,
                        schoolId: tournament.tournaments.school_id
                    });
                    modals.closeAll();
                } catch (error) {
                    console.error("Tournament removal failed:", error);
                }
            }
        })
    }

    const mappedTournaments = [];
    tournaments.map((t) => mappedTournaments.push(
        <Flex style={{ alignItems: "center", gap: "7px" }} key={t.tournament_id}>
            <Link to={`/schools?schoolId=${t.tournaments.school_id}&tournamentId=${t.tournament_id}`}>{t.tournaments.name} ({t.tournaments.year})</Link>
            {[ROLES.PRIMARY, ROLES.ADMIN].includes(schoolRole) && (
                <DeleteIcon onClick={() => removeTournamentModal(t)} />
            )}
        </Flex>
    ));
    if (mappedTournaments.length == 0) mappedTournaments.push("None");
    return <List items={mappedTournaments} />
}