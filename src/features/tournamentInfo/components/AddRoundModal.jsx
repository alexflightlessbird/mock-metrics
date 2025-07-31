import { Modal, Radio, Button, Group, Stack, Text } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useAddRound } from "../hooks/useAddRound";
import useNotifications from "../../../common/hooks/useNotifications";

export default function AddRoundModal({ opened, onClose, existingRounds, caseType, nationalsTournament = false, tournamentId, teamId, caseId }) {
    const [activePage, setActivePage] = useState(0);
    const [formData, setFormData] = useLocalStorage({
        key: "add-round-form",
        defaultValue: {
            roundNumber: null,
            side: null,
        },
    });
    const { mutate: addRound } = useAddRound();
    const { showError } = useNotifications();

    useEffect(() => {
        if (opened) {
            setActivePage(0);
            setFormData({
                roundNumber: null,
                side: null
            });
        }
    }, [opened, setFormData]);

    const validateCurrentPage = () => {
        switch (activePage) {
            case 0:
                return formData.roundNumber !== null && formData.side !== null;
            default:
                return true;
        }
    }

    const handleNext = () => {
        if (validateCurrentPage()) {
            setActivePage(activePage + 1);
        }
    };

    const handleBack = () => {
        setActivePage(activePage - 1);
    };

    const handleSubmit = () => {
        if (!validateCurrentPage()) {
            showError({
                title: "Validation Error",
                message: "Please complete all required fields"
            });
            return;
        }

        addRound({
            tournamentId,
            teamId,
            roundNumber: parseInt(formData.roundNumber),
            side: formData.side
        }, {
            onSuccess: () => {
                onClose();
                localStorage.removeItem("add-round-form");
            }
        })

        if (validateCurrentPage()) {
            console.log("Submitting form:", formData);
            onClose()
            localStorage.removeItem("add-round-form");
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const roundOptions = nationalsTournament ? [1, 2, 3, 4, 5] : [1, 2, 3, 4];
    const sideOptions = caseType === "civil" ? ["Plaintiff", "Defense"] : caseType === "criminal" ? ["Prosecution", "Defense"] : ["Plaintiff/Prosecution", "Defense"];

    const pages = [
        // Page 0: Round and side selection
        <Stack key={0}>
            <Text size="sm" c="dimmed">Select the round number</Text>
            <Radio.Group
                value={formData.roundNumber}
                onChange={(value) => handleInputChange("roundNumber", value)}
                name="roundNumber"
            >
                <Stack mt="xs">
                    {roundOptions.map((num) => (
                        <Radio
                            key={num}
                            value={num.toString()}
                            label={`Round ${num}`}
                            disabled={existingRounds.includes(num)}
                        />
                    ))}
                </Stack>
            </Radio.Group>

            <Text size="sm" c="dimmed">Select the side</Text>
            <Radio.Group
                value={formData.side}
                onChange={(value) => handleInputChange("side", value)}
                name="side"
            >
                <Stack mt="xs">
                    {sideOptions.map((side) => (
                        <Radio
                            key={side}
                            value={side.toLowerCase().slice(0, 1)}
                            label={side}
                        />
                    ))}
                </Stack>
            </Radio.Group> 
        </Stack>,

        // Page 1: Role selection (attorneys vs witnesses)
        <Stack key={1}>
            <Text>Placeholder for future content</Text>
        </Stack>,

        // Page 2: Witness selection
        <Stack key={2}>
            <Text>Placeholder for future content</Text>
        </Stack>,

        // Page 3: Role selection (who did what)
        <Stack key={3}>
            <Text>Placeholder for future content</Text>
        </Stack>
    ];

    return (
        <Modal opened={opened} onClose={onClose} title={`Add Round (Step ${activePage + 1} of 4)`} size="md" centered>
            {pages[activePage]}

            <Group justify="space-between" mt="xl">
                {activePage !== 0 ? (
                    <Button variant="default" onClick={handleBack}>Back</Button>
                ) : (
                    <div />
                )}

                {activePage < pages.length - 1 ? (
                    <Button onClick={handleNext} disabled={!validateCurrentPage()}>
                        Next
                    </Button>
                ) : (
                    <Button onClick={handleSubmit} disabled={!validateCurrentPage()}>
                        Submit
                    </Button>
                )}
            </Group>
        </Modal>
    )
}