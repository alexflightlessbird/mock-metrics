// Dependency imports
import { Link } from "react-router-dom";
import { Box, Flex, Text, Space } from "@mantine/core";
import { modals } from "@mantine/modals";

// Component imports
import List from "../../../../../../common/components/List";
import { DeleteIcon } from "../../../../../../common/components/ActionIcons";
import IconButton from "../../../../../../common/components/IconButton";
import FormModal from "../../../../../../common/components/FormModal";

// Utils imports
import { ROLES } from "../../../../../../utils/constants";

// Hooks imports
import { useSchoolDataMutations } from "../../../../../../hooks/api/useSchoolData";
import { useDisclosure } from "@mantine/hooks";
import { isNotEmpty, useForm } from "@mantine/form";
import { useMemo } from "react";

export default function TeamItem({
    team,
    schoolRole,
    tournamentId,
    pSide,
    teamRounds,
    theme
}) {
    const { removeTeamFromTournament, addTournamentRound } = useSchoolDataMutations();

    const roundOptions = useMemo(() => 
        [1, 2, 3, 4].map((num) => ({
            label: String(num),
            value: String(num),
            disabled: teamRounds.data?.some((r) => Number(r.round_number) === num),
        })),
        [teamRounds.data]
    );

    const allRoundsAssigned = useMemo(() => {
        if (!teamRounds.data) return false;
        const assignedRounds = teamRounds.data.map(r => Number(r.round_number));
        return [1, 2, 3, 4].every(round => assignedRounds.includes(round));
    }, [teamRounds.data]);

    const [addRoundOpened, { open: addRoundOpen, close: addRoundClose }] = useDisclosure(false, {
        onOpen: () => {
            const firstAvailableRound = roundOptions.find(option => !option.disabled)?.value || "1";
            addRoundForm.setValues({
                side: pSide,
                roundNumber: firstAvailableRound
            })
        },
        onClose: () => addRoundForm.reset()
    });

    const addRoundForm = useForm({
        mode: "uncontrolled",
        validate: {
            roundNumber: isNotEmpty("Select an option"),
            side: isNotEmpty("Select an option")
        },
        validateInputOnBlur: true,
        onSubmitPreventDefault: "always"
    });

    function removeTeamModal () {
        modals.openConfirmModal({
            title: `Remove Team: ${team.teams.name}`,
            centered: true,
            children: (
                <Text>
                    Are you sure you want to remove {team.teams.name} from {team.tournaments.name}?
                </Text>
            ),
            labels: { confirm: "Remove", cancel: "Cancel" },
            onConfirm: async () => {
                try {
                    await removeTeamFromTournament({
                        teamId: team.team_id,
                        tournamentId,
                        schoolId: team.teams.school_id,
                    });
                    modals.closeAll();
                } catch (error) {
                    console.error("Team removal failed:", error);
                }
            }
        })
    }

    const sideOptions = [
        {
            label: pSide,
            value: pSide
        },
        {
            label: "Defense",
            value: "Defense"
        }
    ];

    async function handleAddRoundSubmit (values) {
        const { roundNumber, side } = values;
        try {
            await addTournamentRound({
                tournamentId, 
                teamId: team.team_id,
                roundNumber,
                side
            });
            addRoundClose();
        } catch (error) {
            console.error("Round add failed:", error);
        }
    }

    const addRoundModalProps = {
        opened: addRoundOpened,
        onClose: addRoundClose,
        title: `Add Round - ${team.teams.name}`,
        onSubmit: handleAddRoundSubmit,
        form: addRoundForm,
        fields: [
            {
                type: "select",
                name: "roundNumber",
                required: true,
                label: "Round Number",
                options: roundOptions,
                searchable: false,
            },
            {
                type: "select",
                name: "side",
                required: true,
                label: "Side",
                options: sideOptions,
                searchable: false
            }
        ]
    };

    const mappedRounds = teamRounds.data?.map((r) => (
        <Link to={`/schools?schoolId=${team.teams.school_id}&roundId=${r.id}`}>
            Round {r.round_number} ({r.side})
        </Link>
    )) || ["No rounds assigned"];

    return (
        <Box w="60vw">
            <Flex align="center" gap="7px">
                <Link to={`/schools?schoolId=${team.teams.school_id}&teamId=${team.team_id}`}>
                    {team.teams.name}
                </Link>
                {[ROLES.PRIMARY, ROLES.ADMIN].includes(schoolRole) && (
                    <>
                        <DeleteIcon onClick={removeTeamModal} />
                    </>
                )}
            </Flex>
            <Space h="xs" />
            {[ROLES.PRIMARY, ROLES.ADMIN].includes(schoolRole) && !allRoundsAssigned && (
                <>
                    <IconButton
                        buttonText="Add Round"
                        icon="add"
                        color={theme.colors.primaryBlue[0]}
                        onClick={addRoundOpen}
                        disabled={allRoundsAssigned}
                    />
                    <FormModal {...addRoundModalProps} />
                    <Space h="xs" />
                </>
            )}
            <List items={mappedRounds} withPadding={false} />
            <Space h="xs" />
        </Box>
    )
}
