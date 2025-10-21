import { useRef, useState } from "react";
import BaseModal from "./BaseModal";
import { Button, Stack, Flex, Text } from "@mantine/core";
import { capitalize } from "../../utils/helpers";
import { useModal } from "../../../context/ModalContext";
import { useMobile } from "../../../context/MobileContext";

export default function DeleteConfirmationModal({
  onClose,
  onSubmit,
  onSubmitFunction,
  entityName,
  entity,
  trigger,
  closeAllOnCancel = false,
  closeOnSubmit = true,
  closeAllOnSubmit = false,
  layer = 0,
  type = "delete",
  removeFrom = "",
  includeBallots = false,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const firstInputRef = useRef(null);

  const { isMobile } = useMobile();

  const { closeModal, closeAllModals } = useModal();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (onSubmitFunction) await onSubmitFunction();
      else if (onSubmit) await onSubmit(entity.id);
      if (onClose) onClose();
    } finally {
      if (closeOnSubmit)
        closeModal(
          `delete-${entityName}-modal-${entity.id ? entity.id : entity.name}`
        );
      if (closeAllOnSubmit) closeAllModals();
      setIsLoading(false);
    }
  };

  return (
    <BaseModal
      modalId={`delete-${entityName}-modal-${
        entity.id ? entity.id : entity.name
      }`}
      trigger={trigger}
      title={
        type === "delete"
          ? `Delete ${capitalize(entityName)}${
              entity?.name?.length > 0
                ? " (" + capitalize(entity.name) + ")"
                : ""
            }`
          : type === "remove"
          ? `Remove ${capitalize(entityName)}${
              entity?.name?.length > 0
                ? " (" + capitalize(entity.name) + ")"
                : ""
            }`
          : ""
      }
      initialFocusRef={firstInputRef}
      layer={layer}
      disableCloseButton={isLoading}
      maxWidth={isMobile ? undefined : "60vw"}
      footer={
        <Flex
          direction="row"
          align="center"
          justify={isMobile ? "space-between" : "flex-end"}
          gap="sm"
        >
          <Button
            color="red"
            w={isMobile ? "45%" : "auto"}
            onClick={handleSubmit}
            loading={isLoading}
          >
            Delete
          </Button>
          <Button
            ref={firstInputRef}
            color="gray"
            w={isMobile ? "45%" : "auto"}
            onClick={async () => {
              setIsLoading(true);
              if (onClose) await onClose();
              setIsLoading(false);
              if (closeAllOnCancel) {
                closeAllModals();
              } else {
                closeModal(
                  `delete-${entityName}-modal-${
                    entity.id ? entity.id : entity.name
                  }`
                );
              }
            }}
            loading={isLoading}
          >
            Cancel
          </Button>
        </Flex>
      }
    >
      <Stack>
        <Text>
          Are you sure you want to {type}
          {entity?.name?.length > 0 ? " " + capitalize(entity.name) : ""}
          {type === "remove" && removeFrom.length > 0
            ? ` from ${removeFrom}`
            : null}
          ?
        </Text>
        <Text fz="xs">
          This action cannot be reversed. It will permanently {type} all
          information associated with the {entityName}.
          {includeBallots
            ? ` This will also permanently ${type} all associated ballot information.`
            : null}
        </Text>
      </Stack>
    </BaseModal>
  );
}
