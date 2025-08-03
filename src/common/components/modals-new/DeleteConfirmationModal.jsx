import { useRef, useState, useMemo } from "react";
import BaseModal from "./BaseModal";
import {
  useMantineTheme,
  Button,
  Stack,
  Group,
  Flex,
  Text,
  Space,
} from "@mantine/core";
import { capitalize } from "../../utils/helpers";
import { useModal } from "../../../context/ModalContext";
import { emToPx } from "../../utils/helpers";
import { useViewportSize } from "@mantine/hooks";

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
}) {
  const [isLoading, setIsLoading] = useState(false);
  const firstInputRef = useRef(null);

  const { width } = useViewportSize();
  const theme = useMantineTheme();
  const smBreakpointPx = useMemo(
    () => emToPx(parseFloat(theme.breakpoints.sm)),
    [theme.breakpoints.sm]
  );
  const isMobile = width < smBreakpointPx;

  const { closeModal, closeAllModals } = useModal();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (onSubmitFunction) await onSubmitFunction();
      else if (onSubmit) await onSubmit(entity.id);
      if (onClose) onClose();
    } finally {
      if (closeOnSubmit) closeModal(`delete-${entityName}-modal`);
      if (closeAllOnSubmit) closeAllModals();
      setIsLoading(false);
    }
  };

  return (
    <BaseModal
      modalId={`delete-${entityName}-modal`}
      trigger={trigger}
      title={`Delete ${capitalize(entityName)}${
        entity?.name?.length > 0 ? " (" + capitalize(entity.name) + ")" : ""
      }`}
      initialFocusRef={firstInputRef}
      layer={layer}
      disableCloseButton={isLoading}
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
                closeModal(`delete-${entityName}-modal`);
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
          Are you sure you want to delete
          {entity?.name?.length > 0 ? " " + capitalize(entity.name) : ""}?
        </Text>
        <Text fz="xs">
          This action cannot be reversed. It will permanently remove all
          information associated with the {entityName}.
        </Text>
      </Stack>
    </BaseModal>
  );
}
