import { Flex, ActionIcon } from "@mantine/core";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineCheck,
  AiOutlineClose,
} from "react-icons/ai";

export function EditDeleteTableActions({
  onEdit,
  onDelete,
  canDelete = false,
  size = "md",
}) {
  return (
    <Flex wrap="wrap" rowGap="xs" columnGap="xs">
      <ActionIcon size={size} onClick={onEdit}>
        <AiOutlineEdit />
      </ActionIcon>
      {canDelete && (
        <ActionIcon size={size} onClick={onDelete}>
          <AiOutlineDelete />
        </ActionIcon>
      )}
    </Flex>
  );
}

export function ConfirmCancelTableActions({
  onConfirm,
  onCancel,
  size = "md",
}) {
  return (
    <Flex wrap="wrap" rowGap="xs" columnGap="xs">
      <ActionIcon size={size} onClick={onConfirm}>
        <AiOutlineCheck />
      </ActionIcon>
      <ActionIcon color="gray" size={size} onClick={onCancel}>
        <AiOutlineClose />
      </ActionIcon>
    </Flex>
  );
}
