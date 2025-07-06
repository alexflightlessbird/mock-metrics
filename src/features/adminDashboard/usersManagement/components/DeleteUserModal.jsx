import { useState } from "react";
import { Text, Space, Flex, Button } from "@mantine/core";
import BaseModal from "../../../../common/components/BaseModal";

export default function DeleteUserModal({ opened, onClose, user, onSubmit }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSubmit(user.id);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseModal
      opened={opened}
      onClose={onClose}
      title={`Delete User (${user?.name})`}
    >
      <Text>
        Woah, hold up! Are you sure you want to delete
        {user?.name?.length > 0 ? " " + user.name : ""}?
      </Text>
      <Text fz="xs">
        This action cannot be reversed and will permanently remove all
        information associated with the user.
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
