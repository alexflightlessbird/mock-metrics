import { Flex, ActionIcon } from "@mantine/core";
import {
  LuPencilLine as EditIcon,
  LuTrash as DeleteIcon,
  LuCheck as CheckIcon,
  LuX as CloseIcon,
} from "react-icons/lu";

export function EditDeleteTableActions({
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = false,
  size = "md",
}) {
  return (
    <Flex wrap="wrap" rowGap="xs" columnGap="xs">
      {canEdit && (
        <ActionIcon size={size} onClick={onEdit}>
          <EditIcon />
        </ActionIcon>
      )}
      {canDelete && (
        <ActionIcon size={size} onClick={onDelete}>
          <DeleteIcon />
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
        <CheckIcon />
      </ActionIcon>
      <ActionIcon color="gray" size={size} onClick={onCancel}>
        <CloseIcon />
      </ActionIcon>
    </Flex>
  );
}
