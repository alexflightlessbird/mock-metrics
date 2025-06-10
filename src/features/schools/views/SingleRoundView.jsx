// Dependency imports
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Flex, Text } from "@mantine/core";
import { isInRange, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks";

// Component imports
import EntityHeader from "../components/EntityHeader";
import FormModal from "../../../common/components/FormModal";

// Utils imports
import { ROLES } from "../../../utils/constants";

// Hooks imports
import {
  useSchoolStudents,
  useSchoolStudentTeams,
} from "../../../hooks/api/useSchoolData";
import {
  useRoundWitnesses,
  useRoundRoles,
  useRoundDataMutations,
} from "../../../hooks/api/useRoundData";

export default function SingleRound({ selectedRound, schoolRole, schoolName }) {
  const { deleteRound } = useRoundDataMutations();

  const navigate = useNavigate();

  const { data: allWitnesses = [], isPending: isWitnessesPending } =
    useRoundWitnesses(selectedRound.id);
  const { data: allRoles = [], isPending: isRolesPending } = useRoundRoles(
    selectedRound.id
  );
  const { data: allStudents = [], isPending: isStudentsPending } =
    useSchoolStudents(selectedRound.tournaments.school_id);
  const { data: allStudentTeams = [], isPending: isStudentTeamsPending } =
    useSchoolStudentTeams(selectedRound.tournaments.school_id);

  function deleteRoundModal() {
    modals.openConfirmModal({
      title: `Delete Round: ${selectedRound.round_number}`,
      centered: true,
      children: (
        <Text>
          Are you sure you want to delete round {selectedRound.round_number} for
          team {selectedRound.teams.name} for tournament{" "}
          {selectedRound.tournaments.name}?
          <br />
          This action is not reversible and data cannot be recovered. All data,
          including ballots, will be 100% removed.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      onConfirm: async () => {
        try {
          await deleteRound({
            roundId: selectedRound.id,
            tournamentId: selectedRound.tournament_id,
            schoolId: selectedRound.tournaments.school_id,
          });
          modals.closeAll();
          navigate(
            `/schools?schoolId=${selectedRound.tournaments.school_id}&tournamentId=${selectedRound.tournament_id}`
          );
        } catch (error) {
          console.error("Round deletion failed:", error);
        }
      },
    });
  }

  console.log(selectedRound);
  return (
    <div>
      Round page for {selectedRound.round_number} of{" "}
      {selectedRound?.tournaments?.name} for team {selectedRound?.teams?.name}{" "}
    </div>
  );
}
