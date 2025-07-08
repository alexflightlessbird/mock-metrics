import DeleteConfirmationModal from "../../../../common/components/modals/DeleteConfirmationModal";

export default function DeleteCaseModal({
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
      entityName="case"
      entity={selected}
    />
  );
}
