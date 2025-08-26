import { useMemo, useState } from "react";
import { useTournamentTeams } from "../../../common/hooks/useTournamentDetails";
import { useSchoolTeams } from "../../../common/hooks/useSchoolDetails";
import { useLocalStorage } from "@mantine/hooks";
import BaseModal from "../../../common/components/modals-new/BaseModal";
import { Button, Flex, Text } from "@mantine/core";
import { ModalSelect } from "../../../common/components/modals-new/ModalDropdownComponents";
import Loader from "../../../common/components/loader/GavelLoader";
import { useModal } from "../../../context/ModalContext";

export default function AddTeamModal({
  trigger,
  tournamentId,
  tournamentName,
}) {
  const [selectedSchoolId] = useLocalStorage({
    key: "school",
    defaultValue: null,
  });

  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const {
    data: currentTeams,
    isLoading: currentTeamsLoading,
    addTeam: addTeamToTournament,
  } = useTournamentTeams(tournamentId);
  const { data: allTeams, isLoading: allTeamsLoading } =
    useSchoolTeams(selectedSchoolId);
  const { closeModal } = useModal();

  const currentTeamsIdList = useMemo(
    () => currentTeams?.map((t) => t.team_id) || [],
    [currentTeams]
  );
  const availableTeams = useMemo(
    () =>
      allTeams
        ?.filter((t) => t.is_active)
        .filter((t) => !currentTeamsIdList?.includes(t.id)) || [],
    [allTeams, currentTeamsIdList]
  );

  const handleSubmit = () => {
    addTeamToTournament(
      {
        teamId: selectedTeamId,
        tournamentId,
      },
      {
        onSuccess: () => {
          setSelectedTeamId(null);
          closeModal(`add-team-to-tournament-form-${tournamentId}`);
        },
      }
    );
  };

  return (
    <BaseModal
      modalId={`add-team-to-tournament-form-${tournamentId}`}
      trigger={trigger}
      title={
        currentTeamsLoading || allTeamsLoading
          ? "Loading..."
          : `Add Team to ${tournamentName}`
      }
      footer={
        availableTeams.length !== 0 && (
          <Flex justify="end">
            <Button onClick={handleSubmit} disabled={!selectedTeamId}>
              Submit
            </Button>
          </Flex>
        )
      }
      maxWidth="50vw"
      fullOnMobile={true}
    >
      {(currentTeamsLoading || allTeamsLoading) && <Loader />}
      {!currentTeamsLoading &&
        !allTeamsLoading &&
        availableTeams.length === 0 && (
          <Text c="dimmed">
            All teams have already been added to this tournament.
          </Text>
        )}
      {!currentTeamsLoading &&
        !allTeamsLoading &&
        availableTeams.length > 0 && (
          <ModalSelect
            label="Select team to add"
            data={availableTeams.map((t) => ({
              label: t.name,
              value: t.id,
            }))}
            value={selectedTeamId}
            onChange={setSelectedTeamId}
          />
        )}
    </BaseModal>
  );
}
