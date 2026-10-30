import {
  Button,
  Group,
  Paper,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { LuArrowUpRight } from "react-icons/lu";

export default function AnnouncementBanner({
  label = "A quick update",
  title,
  description,
  actionLabel,
  actionHref,
  icon,
  color = "blue",
  mb = "md",
}) {
  return (
    <Paper
      withBorder
      radius="md"
      p="sm"
      mb={mb}
      style={{
        borderInlineStart: `3px solid var(--mantine-color-${color}-6)`,
      }}
    >
      <Group justify="space-between" align="center" gap="sm" wrap="wrap">
        <Group align="center" gap="sm" style={{ flex: "1 1 280px" }}>
          {icon && (
            <ThemeIcon size={34} radius="xl" variant="light" color={color}>
              {icon}
            </ThemeIcon>
          )}
          <div style={{ flex: 1 }}>
            {label && (
              <Text size="xs" fw={700} c={color} tt="uppercase" mb={2}>
                {label}
              </Text>
            )}
            <Text fw={600} size="sm" lh={1.3}>
              {title}
            </Text>
            <Text size="sm" c="dimmed" lh={1.4}>
              {description}
            </Text>
          </div>
        </Group>
        {actionLabel && actionHref && (
          <Button
            component="a"
            href={actionHref}
            color={color}
            variant="light"
            size="sm"
            rightSection={<LuArrowUpRight size="1rem" />}
          >
            {actionLabel}
          </Button>
        )}
      </Group>
    </Paper>
  );
}
