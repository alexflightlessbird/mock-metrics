import { useState } from "react";
import { Text, Space, Flex, Button } from "@mantine/core";
import BaseModal from "../../../../common/components/BaseModal";

export default function DeleteSchoolModal({
  opened,
  onClose,
  selected,
  onSubmit,
}) {
  const school = selected;

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSubmit(school.id);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseModal
      opened={opened}
      onClose={onClose}
      title={`Delete School (${school?.name})`}
    >
      <Text>
        Woah, hold up! Are you sure you want to delete
        {school?.name?.length > 0 ? " " + school.name : ""}?
      </Text>
      <Text fz="xs">
        This action cannot be reversed and will permanently remove all
        information associated with the school.
      </Text>
      <Space h="sm" />
      <Flex direction="row" align="center" justify="space-between">
        <Button color="red" w="45%" onClick={handleSubmit} loading={isLoading}>
          Delete
          {school?.short_name?.length > 0 ? " " + school.short_name : ""}
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
