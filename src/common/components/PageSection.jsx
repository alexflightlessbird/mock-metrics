import { Box, Text, Stack, Divider } from "@mantine/core";

export default function PageSection({ title, children }) {
  return (
    <Box>
      <Text fw={500} size="sm" c="dimmed" tt="uppercase">
        {title}
      </Text>
      <Divider my="xs" />

      <Stack gap="xs">{children}</Stack>
    </Box>
  );
}
