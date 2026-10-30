import {
  Avatar,
  Box,
  Divider,
  Paper,
  Stack,
  Text,
  Group,
  Button,
  Switch,
  TextInput,
  useMantineTheme,
  ColorSwatch,
  Tooltip,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { LuSun, LuMoon } from "react-icons/lu";
import BasePage from "../common/components/BasePage";
import ShowIdText from "../common/components/ShowIdText";
import PageSection from "../common/components/PageSection";
import { useUserDetails } from "../common/hooks/useUserDetails";

export default function SettingsPage() {
  const { toggleTheme, isDark } = useTheme();
  const { user } = useAuth();
  const theme = useMantineTheme();
  const {
    data: userDetails,
    isLoading: isLoadingUserDetails,
    updateName,
    isUpdatingName,
  } = useUserDetails(user.id);
  const [name, setName] = useState("");

  useEffect(() => {
    if (userDetails?.name) setName(userDetails.name);
  }, [userDetails?.name]);

  const handleNameSubmit = (event) => {
    event.preventDefault();
    const updatedName = name.trim();
    if (!updatedName) return;
    if (updatedName === userDetails?.name) return;

    updateName(updatedName);
  };

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
          <Paper withBorder radius="md" p={{ base: "md", sm: "lg" }}>
            <Stack gap="md">
              <Group gap="sm" wrap="nowrap">
                <Avatar color="blue" radius="xl" size="lg">
                  {name.trim().charAt(0).toUpperCase() || "U"}
                </Avatar>
                <Box>
                  <Text fw={600}>{name.trim() || "Your account"}</Text>
                  <Text size="sm" c="dimmed">
                    Manage the details associated with your account.
                  </Text>
                </Box>
              </Group>

              <Divider />

              <form onSubmit={handleNameSubmit}>
                <Stack gap="sm">
                  <Group align="flex-end" gap="sm" wrap="wrap">
                    <TextInput
                      label="Name"
                      value={name}
                      onChange={(event) => setName(event.currentTarget.value)}
                      maxLength={100}
                      autoComplete="name"
                      required
                      disabled={isLoadingUserDetails || isUpdatingName}
                      style={{ flex: "1 1 220px" }}
                    />
                    <Button
                      type="submit"
                      loading={isUpdatingName}
                      disabled={
                        isLoadingUserDetails ||
                        !name.trim() ||
                        name.trim() === userDetails?.name
                      }
                    >
                      Save changes
                    </Button>
                  </Group>
                </Stack>
              </form>

              <Divider />

              <Stack gap={2}>
                <Text size="sm" fw={500}>
                  Email address
                </Text>
                <Text size="sm" c="dimmed">
                  {user.email}
                </Text>
              </Stack>

              <ShowIdText idName="User" idValue={user.id} />
            </Stack>
          </Paper>
        </PageSection>
      </Stack>
    </BasePage>
  );
}
