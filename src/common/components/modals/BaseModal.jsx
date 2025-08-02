import { Modal } from "@mantine/core";

export default function BaseModal({
  opened,
  onClose,
  title,
  children,
  size = "100%",
  centered = true,
  fullScreen = false,
  withCloseButton = true,
}) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size={size}
      centered={centered}
      mah="80vh"
      fullScreen={fullScreen}
      withCloseButton={withCloseButton}
      overlayProps={{ backgroundOpacity: 0.4, blur: 3 }}
    >
      {children}
    </Modal>
  );
}
