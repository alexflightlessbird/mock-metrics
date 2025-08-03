import * as Dialog from "@radix-ui/react-dialog";
import {
  useMantineTheme,
  Title,
  ActionIcon,
  Overlay,
  ScrollArea,
} from "@mantine/core";
import { useEffect, useRef, useMemo } from "react";
import { LuX } from "react-icons/lu";
import { useViewportSize } from "@mantine/hooks";
import { emToPx } from "../../utils/helpers";
import { useTheme } from "../../../context/ThemeContext";
import { useModal } from "../../../context/ModalContext";

export default function MantineStyledDialog({
  modalId,
  trigger,
  title,
  children,
  onClose,
  initialFocusRef,
  layer = 0,
  maxWidth: widthVal,
  closeButtonClosesAll = false,
  footer,
  ...props
}) {
  const theme = useMantineTheme();
  const contentRef = useRef(null);
  const { isDark } = useTheme();
  const { width } = useViewportSize();
  const { isOpen, openModal, closeModal, closeAllModals } = useModal();

  const smBreakpointPx = useMemo(
    () => emToPx(parseFloat(theme.breakpoints.sm)),
    [theme.breakpoints.sm]
  );
  const isMobile = width < smBreakpointPx;

  if (!widthVal) {
    widthVal = isMobile ? "100vw" : "90vw";
  }

  const handleClose = (shouldCloseAll = false) => {
    if (shouldCloseAll) {
      closeAllModals();
    } else {
      closeModal(modalId);
    }
    if (onClose) onClose();
  };

  const handleOpenChange = (open) => {
    if (open) {
      openModal(modalId);
    } else {
      handleClose();
    }
  };

  // Enhanced focus management
  useEffect(() => {
    if (!isOpen(modalId) || !contentRef.current) return;

    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    const getFocusableElements = () => {
      return Array.from(
        contentRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
      );
    };

    // Set initial focus
    const focusableElements = getFocusableElements();
    if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
    } else if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [props.open, initialFocusRef]);

  return (
    <Dialog.Root
      open={isOpen(modalId)}
      onOpenChange={handleOpenChange}
      {...props}
    >
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}

      <Dialog.Portal>
        <Overlay blur={1} zIndex={1000 + layer} pos="fixed" />
        <Dialog.Overlay
          style={{
            backgroundColor: theme.colors.dark[9],
            opacity: 0.4,
            position: "fixed",
            inset: 0,
            zIndex: 1000 + layer,
          }}
        />
        <Dialog.Content
          ref={contentRef}
          style={{
            backgroundColor: "var(--mantine-color-body)",
            borderRadius: theme.radius.md,
            boxShadow: theme.shadows.xl,
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: widthVal,
            maxHeight: isMobile ? "100vh" : "90vh",
            padding: theme.spacing.md,
            zIndex: 1001 + layer,
            display: "flex",
            flexDirection: "column",
            "&:focus": { outline: "none" },
          }}
          aria-describedby={undefined}
        >
          {title && (
            <Dialog.Title
              asChild
              style={{
                borderBottom: `1px solid ${theme.colors.gray[3]}`,
                paddingBottom: theme.spacing.xs,
                marginBottom: theme.spacing.xs,
              }}
            >
              <Title order={3}>{title}</Title>
            </Dialog.Title>
          )}

          <ScrollArea.Autosize
            style={{
              flex: 1,
              minHeight: 0,
            }}
            type="scroll"
            offsetScrollbars
          >
            {children}
          </ScrollArea.Autosize>

          {footer && (
            <div
              style={{
                marginTop: theme.spacing.xs,
              }}
            >
              {footer}
            </div>
          )}

          <Dialog.Close asChild>
            <ActionIcon
              variant="subtle"
              style={{
                position: "absolute",
                top: theme.spacing.sm,
                right: theme.spacing.sm,
              }}
              aria-label="Close"
              color={isDark ? theme.white : "dark"}
              onClick={() => handleClose(closeButtonClosesAll)}
            >
              <LuX />
            </ActionIcon>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
