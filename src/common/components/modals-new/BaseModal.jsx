import * as Dialog from "@radix-ui/react-dialog";
import {
  useMantineTheme,
  Title,
  ActionIcon,
  Overlay,
  ScrollArea,
} from "@mantine/core";
import { useEffect, useRef, cloneElement } from "react";
import { LuX } from "react-icons/lu";
import { useTheme } from "../../../context/ThemeContext";
import { useModal } from "../../../context/ModalContext";
import { useMobile } from "../../../context/MobileContext";

export default function BaseModal({
  modalId,
  trigger,
  title,
  children,
  onClose,
  initialFocusRef,
  layer = 0,
  maxWidth: widthVal,
  fullOnMobile = false,
  closeButtonClosesAll = false,
  footer,
  disableCloseButton = false,
  ...props
}) {
  const theme = useMantineTheme();
  const contentRef = useRef(null);
  const { isDark } = useTheme();
  const { isOpen, openModal, closeModal, closeAllModals } = useModal();

  const { isMobile } = useMobile();

  if (!widthVal) {
    widthVal = isMobile ? "100vw" : "90vw";
  }

  if (widthVal && fullOnMobile) {
    widthVal = isMobile ? "100vw" : widthVal;
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

  const enhancedTrigger = trigger
    ? cloneElement(trigger, {
        onKeyDown: (e) => {
          // Call existing onKeyDown if it exists
          if (trigger.props.onKeyDown) {
            trigger.props.onKeyDown(e);
          }

          // Open modal on Enter key press
          if (e.key === "Enter" && !e.defaultPrevented) {
            e.preventDefault();
            e.stopPropagation();
            openModal(modalId);
          }
        },
        role: "button", // Ensure proper accessibility
        tabIndex: trigger.props.tabIndex ?? 0, // Make focusable if not already
      })
    : null;

  // Enhanced focus management
  useEffect(() => {
    if (!isOpen(modalId)) return;

    // Focus management function
    const manageFocus = () => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
        return;
      }

      const focusableElements = getFocusableElements().filter(
        (el) => !el.className.includes("mantine-NumberInput-control")
      );

      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    };

    // Try to focus immediately and also set a timeout as backup
    manageFocus();
    const timeoutId = setTimeout(manageFocus, 50);

    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        e.stopPropagation();

        const focusableElements = getFocusableElements().filter(
          (el) => !el.className.includes("mantine-NumberInput-control")
        );
        if (focusableElements.length === 0) return;

        const currentIndex = focusableElements.indexOf(document.activeElement);

        if (e.shiftKey) {
          // Shift+Tab - move backward
          const prevIndex =
            currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
          focusableElements[prevIndex].focus();
        } else {
          // Tab - move forward
          const nextIndex =
            currentIndex === focusableElements.length - 1
              ? 0
              : currentIndex + 1;
          focusableElements[nextIndex].focus();
        }
      }
    };

    function getFocusableElements() {
      if (!contentRef.current) return [];
      return Array.from(
        contentRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
      );
    }

    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
      clearTimeout(timeoutId);
    };
  }, [isOpen(modalId), initialFocusRef]);

  return (
    <Dialog.Root
      open={isOpen(modalId)}
      onOpenChange={handleOpenChange}
      {...props}
    >
      {enhancedTrigger && (
        <Dialog.Trigger asChild>{enhancedTrigger}</Dialog.Trigger>
      )}

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
          onClick={(e) => e.stopPropagation()}
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
            disabled={disableCloseButton}
          >
            <LuX />
          </ActionIcon>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
