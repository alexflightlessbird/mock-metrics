import * as Dialog from "@radix-ui/react-dialog";
import {
	useMantineTheme,
	Button,
	Title,
	Text,
	ActionIcon,
	Divider,
} from "@mantine/core";
import { useEffect, useRef } from "react";
import { LuX } from "react-icons/lu";

export default function MantineStyledDialog({
	trigger,
	title,
	children,
	onClose,
	initialFocusRef,
	layer = 0,
	...props
}) {
	const theme = useMantineTheme();
	const contentRef = useRef(null);

	// Enhanced focus management
	useEffect(() => {
		if (!props.open || !contentRef.current) return;

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
		<Dialog.Root {...props}>
			{trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}

			<Dialog.Portal>
				<Dialog.Overlay
					style={{
						backgroundColor: theme.colors.dark[9],
						opacity: 0.8,
						position: "fixed",
						inset: 0,
						zIndex: 1000 + layer,
					}}
				/>

				<Dialog.Content
					ref={contentRef}
					style={{
						backgroundColor:
							theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
						borderRadius: theme.radius.md,
						boxShadow: theme.shadows.xl,
						position: "fixed",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: "90vw",
						maxWidth: "450px",
						maxHeight: "85vh",
						padding: theme.spacing.md,
						zIndex: 1001 + layer,
						"&:focus": { outline: "none" },
					}}
					aria-describedby={undefined}
				>
					{title && (
						<Dialog.Title asChild>
							<>
								<Title order={3} mb="xs">
									{title}
								</Title>
								<Divider mb="sm" aria-hidden />
							</>
						</Dialog.Title>
					)}

					{children}

					<Dialog.Close asChild>
						<ActionIcon
							variant="subtle"
							style={{
								position: "absolute",
								top: theme.spacing.sm,
								right: theme.spacing.sm,
							}}
							aria-label="Close"
							color="dark"
						>
							<LuX />
						</ActionIcon>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
