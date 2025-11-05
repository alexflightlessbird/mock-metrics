import { Button, Flex, Text, Space } from "@mantine/core";
import PageSection from "./PageSection";
import DeleteConfirmationModal from "./modals-new/DeleteConfirmationModal";
import { LuTrash } from "react-icons/lu";

export default function DangerZoneSection ({ buttonLabel, includeBallots, onSubmit, entity, entityName, spaceHeight = "md", ...modalProps }) {
    return (
        <>
            <PageSection title="danger zone">
                <Flex gap="xl" align="center">
                    <Text flex={1} c="red" fw={700} size="sm">
                        THIS ACTION CANNOT BE REVERSED. PLEASE PROCEED WITH CAUTION.
                    </Text>

                    <DeleteConfirmationModal
                        trigger={
                            <Button
                            w="fit-content"
                            leftSection={<LuTrash />}
                            color="red"
                            variant="outline"
                            >
                                Delete{buttonLabel ? " " + buttonLabel : ""}
                            </Button>
                        }
                        includeBallots={includeBallots}
                        onSubmit={onSubmit}
                        entity={entity}
                        entityName={entityName}
                        {...modalProps}
                    />
                </Flex>
            </PageSection>

            <Space h={spaceHeight} />
        </>
    )
}