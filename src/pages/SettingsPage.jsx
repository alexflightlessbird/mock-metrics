import {
  Stack,
  Text,
  Group,
  Switch,
  useMantineTheme,
  ColorSwatch,
  Tooltip,
} from "@mantine/core";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { LuSun, LuMoon } from "react-icons/lu";
import BasePage from "../common/components/BasePage";
import ShowIdText from "../common/components/ShowIdText";
import PageSection from "../common/components/PageSection";

export default function SettingsPage() {
  const { toggleTheme, isDark } = useTheme();
  const { user } = useAuth();
  const theme = useMantineTheme();

  return (
    <BasePage titleText="Settings">
      <Stack gap="lg">
        <PageSection title="appearance">
          <Group justify="space-between">
            <Group gap="xs">
              <ColorSwatch
                color={isDark ? theme.colors.dark[5] : theme.colors.gray[2]}
                size={20}
              />
              <Text>Theme</Text>
            </Group>

            <Tooltip
              label={`Switch to ${isDark ? "light" : "dark"} mode`}
              refProp="rootRef"
            >
              <Switch
                size="lg"
                checked={isDark}
                onChange={toggleTheme}
                thumbIcon={
                  isDark ? (
                    <LuMoon size="0.8rem" color={theme.colors.yellow[4]} />
                  ) : (
                    <LuSun size="0.8rem" color={theme.colors.orange[6]} />
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleTheme();
                  }
                }}
              />
            </Tooltip>
          </Group>
        </PageSection>

        <PageSection title="account">
          <Text>Email: {user.email}</Text>
          <ShowIdText idName="User" idValue={user.id} />
        </PageSection>
      </Stack>
    </BasePage>
  );
}
