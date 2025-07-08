import DeleteConfirmationModal from "../../../../common/components/modals/DeleteConfirmationModal";

export default function DeleteUserModal({
  opened,
  onClose,
  selected,
  onSubmit,
}) {
  return (
    <DeleteConfirmationModal
      opened={opened}
      onClose={onClose}
      onSubmit={onSubmit}
      entityName="user"
      entity={selected}
    />
  );
}
