import { useState } from "react";
import { LuCopy as CopyIcon, LuCopyCheck as CopiedIcon } from "react-icons/lu";
import { Stack, Text, Group, ActionIcon } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";

export default function ShowIdText({ idName, idValue }) {
  const clipboard = useClipboard({ timeout: 1000 });

  const [showId, setShowId] = useState(false);

  return (
    <Stack gap="0">
      <Text
        span
        style={{
          cursor: "pointer",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
        c="blue"
        onClick={() => {
          setShowId(!showId);
        }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.onClick();
          }
        }}
      >
        {showId ? `Hide ${idName} ID` : `Show ${idName} ID (Support Purposes)`}
      </Text>
      {showId && (
        <Group gap="xs">
          <Text fz="xs">{idValue}</Text>
          <ActionIcon
            size="md"
            fz="lg"
            variant="subtle"
            color={clipboard.copied ? "cyan" : "blue"}
            onClick={() => clipboard.copy(idValue)}
          >
            {clipboard.copied ? <CopiedIcon /> : <CopyIcon />}
          </ActionIcon>
        </Group>
      )}
    </Stack>
  );
}
