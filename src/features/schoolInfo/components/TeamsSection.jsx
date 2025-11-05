import { useSchoolTeams } from "../../../common/hooks/useSchoolDetails";
import { useArchiveTeam, useUnarchiveTeam } from "../hooks/useArchiveTeam";
import Loader from "../../../common/components/loader/GavelLoader";
import { Skeleton, Stack } from "@mantine/core";
import AddTeamModal from "./AddTeamModal";
import AddButton from "../../../common/components/AddButton";
import SearchableSection from "./SearchableSection";

export default function TeamsSection({ schoolId, role, isMobile, navigate }) {
    const { data: teams = [], isLoading: teamsLoading = true } = useSchoolTeams(schoolId);
    const { mutate: archiveTeam } = useArchiveTeam();
    const { mutate: unarchiveTeam } = useUnarchiveTeam();

    if (teamsLoading) return (
        <Stack>
            <Skeleton height={50} width="100%" />
            <Loader scale={1.5} />
        </Stack>
    );

    return (
        <SearchableSection
            items={teams}
            onArchive={(teamId) => archiveTeam({ teamId, schoolId })}
            onUnarchive={(teamId) => unarchiveTeam({ teamId, schoolId })}
            isMobile={isMobile}
            navigateLink="/school/t/"
            sectionName="teams"
            addModal={<AddTeamModal schoolId={schoolId} trigger={<AddButton w={isMobile ? "100%" : "auto"}>Add Team</AddButton>} />}
            role={role}
            navigate={navigate}
        />
    )
}