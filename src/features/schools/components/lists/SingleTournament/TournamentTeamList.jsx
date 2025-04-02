// Dependency imports
import { Link } from "react-router-dom";
import { Flex, Text, Select } from "@mantine/core";
import { modals } from "@mantine/modals";

// Component imports
import List from "../../../../../common/components/List";
import { DeleteIcon } from "../../../../../common/components/ActionIcons";

// Utils imports
import { ROLES } from "../../../../../utils/constants";

// Hooks imports
import { useSchoolDataMutations } from "../../../../../hooks/api/useSchoolData";

export default function TourmamentTeamList({ teams, schoolRole }) {
    const { removeTeamFromTournament } = useSchoolDataMutations();

    const removeTeamModal = (team) => {
        modals.openConfirmModal({
            title: `Remove Team: ${team.teams.name}`,
            centered: true,
            children: (
                <Text>
                    Are you sure you want to remove {team.teams.name} from {team.tournaments.name}?<br /><br />Removing the team will remove all data (including ballots) associated between this team and this tournament. This action is not reversible and data cannot be recovered.
                </Text>
            ),
            labels: { confirm: "Remove", cancel: "Cancel" },
            onConfirm: async () => {
                try {
                    await removeTeamFromTournament({
                        teamId: team.team_id,
                        tournamentId: team.tournament_id,
                        schoolId: team.teams.school_id
                    });
                    modals.closeAll();
                } catch (error) {
                    console.error("Team removal failed:", error);
                }
            }
        })
    }

    const mappedTeams = [];
    teams.map((t) => mappedTeams.push(
        <Flex style={{ alignItems: "center", gap: "7px" }} key={t.team_id}>
            <Link to={`/schools?schoolId=${t.teams.school_id}&teamId=${t.team_id}`}>{t.teams.name}</Link>
            {[ROLES.PRIMARY, ROLES.ADMIN].includes(schoolRole) && (
                <DeleteIcon onClick={() => removeTeamModal(t)} />
            )}
        </Flex>
    ));
    if (mappedTeams.length == 0) mappedTeams.push("None");
    return <List items={mappedTeams} />
}