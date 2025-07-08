import DeleteConfirmationModal from "../../../../common/components/modals/DeleteConfirmationModal";

export default function DeleteSchoolModal({
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
      entityName="school"
      entity={selected}
    />
  );
}
