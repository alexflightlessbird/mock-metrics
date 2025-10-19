import { Box, Text, Stack, Divider, Group, ActionIcon } from "@mantine/core";
import { useState } from "react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

export default function PageSection({ title, collapsible = false, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box>
      <Group
        justify="space-between"
        align="center"
        onClick={() => collapsible && setIsOpen(!isOpen)}
        style={{ cursor: collapsible ? "pointer" : "default" }}
      >
        <Text fw={500} size="sm" c="dimmed" tt="uppercase">
          {title}
        </Text>
        {collapsible && (
          <ActionIcon variant="transparent" c="dimmed">
            {isOpen && <LuChevronUp />}
            {!isOpen && <LuChevronDown />}
          </ActionIcon>
        )}
      </Group>
      <Divider my="xs" />
      {(!collapsible || (collapsible && isOpen)) && (
        <Stack gap="xs">{children}</Stack>
      )}
    </Box>
  );
}
