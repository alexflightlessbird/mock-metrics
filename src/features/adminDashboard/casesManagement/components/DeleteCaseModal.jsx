import { useState } from "react";
import { Modal, Text, Space, Flex, Button } from "@mantine/core";

export default function DeleteCaseModal ({ opened, onClose, caseVal, onSubmit }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            await onSubmit(caseVal.id);
            onClose();
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Delete Case"
            centered
            withCloseButton
            overlayProps={{ backgroundOpacity: 0.4, blur: 3 }}
        >
            <Text>Woah, hold up! Are you sure you want to delete{caseVal?.name?.length > 0 ? " " + caseVal.name : ""}?</Text>
            <Text fx="xs">This action cannot be reversed and will permanently remove all information associated with the case.</Text>
            <Space h="sm" />
            <Flex 
                direction="row" 
                align="center" 
                justify="space-between"
            >
                <Button
                    color="red"
                    w="45%"
                    onClick={handleSubmit}
                    loading={isLoading}
                >
                    Delete Case
                </Button>
                <Button
                    data-autofocus
                    color="gray"
                    w="45%"
                    onClick={onClose}
                    loading={isLoading}
                >
                    Cancel
                </Button>
            </Flex>
        </Modal>
    )
}