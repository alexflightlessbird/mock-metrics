import { useState } from "react";
import { Text, Space, Flex, Button } from "@mantine/core";
import BaseModal from "./BaseModal";
import { capitalize } from "../../utils/helpers";

export default function DeleteConfirmationModal({
  opened,
  onClose,
  onSubmit,
  entityName,
  entity,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSubmit(entity.id);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseModal
      opened={opened}
      onClose={onClose}
      title={`Delete ${capitalize(entityName)}${
        entity?.name?.length > 0 ? " (" + capitalize(entity.name) + ")" : ""
      }`}
    >
      <Text>
        Woah, hold up! Are you sure you want to delete
        {entity?.name?.length > 0 ? " " + capitalize(entity.name) : ""}?
      </Text>
      <Text fz="xs">
        This action cannot be reversed and will permanently remove all
        information associated with the {entityName}.
      </Text>
      <Space h="sm" />
      <Flex direction="row" align="center" justify="space-between">
        <Button color="red" w="45%" onClick={handleSubmit} loading={isLoading}>
          Delete
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
    </BaseModal>
  );
}
