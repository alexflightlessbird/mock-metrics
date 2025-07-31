import { Overlay, Text } from "@mantine/core";

export default function BetaOverlay() {
	return (
		<Overlay
			backgroundOpacity={0}
			style={{
				position: "fixed",
				zIndex: 1,
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				pointerEvents: "none",
				display: "grid",
				gridTemplateColumns: "repeat(8, 1fr)",
				gap: "3rem",
				padding: "4rem",
				opacity: 0.1,
				transform: "rotate(-15deg)",
				transformOrigin: "center center",
			}}
		>
			{Array.from({ length: 32 }).map((_, i) => (
				<Text
					key={i}
					fw={900}
					c="gray"
					style={{
						fontSize: "3.5rem",
						lineHeight: 1,
						textAlign: "center",
						fontStyle: "italic",
					}}
				>
					BETA
				</Text>
			))}
		</Overlay>
	);
}
