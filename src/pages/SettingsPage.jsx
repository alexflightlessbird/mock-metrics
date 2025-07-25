import { 
  Stack, Text, 
  Group, ActionIcon, Box, Divider, Switch, 
  useMantineTheme, ColorSwatch, Tooltip , MantineProvider, createTheme
} from "@mantine/core";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext"; 
import { LuCopy as CopyIcon, LuCopyCheck as CopiedIcon, LuSun, LuMoon } from "react-icons/lu";
import { useClipboard } from "@mantine/hooks";
import { useState } from "react";
import BasePage from "../common/components/BasePage";

export default function SettingsPage() {
    const { toggleTheme, isDark } = useTheme();
    const { user } = useAuth();
    const clipboard = useClipboard({ timeout: 1000 });
    const [showUserId, setShowUserId] = useState(false);
    const theme = useMantineTheme();

    const theme2 = createTheme({
        cursorType: "pointer"
    });

    return (
        <BasePage titleText="Settings">
            <Stack gap="lg">
                {/* Appearance Section */}
                <Box>
                    <Text fw={500} size="sm" c="dimmed" tt="uppercase">Appearance</Text>
                    <Divider my="xs" />
                    
                    <Stack gap="xs">
                        <Group justify="space-between">
                            <Group gap="xs">
                                <ColorSwatch 
                                color={isDark ? theme.colors.dark[5] : theme.colors.gray[2]} 
                                size={20} 
                                />
                                <Text>Theme</Text>
                            </Group>
                            
                            <Tooltip label={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
                                <Box style={{ display: "inline-block" }}>
                                    <MantineProvider theme={theme2}>
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
                                                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleTheme(); }
                                            }}
                                        />
                                    </MantineProvider>
                                </Box>
                            </Tooltip>
                        </Group>
                    </Stack>
                </Box>

                {/* Account Section */}
                <Box>
                    <Text fw={500} size="sm" c="dimmed" tt="uppercase">Account</Text>
                    <Divider my="xs" />
                    
                    <Stack gap="xs">
                        <Text>Email: {user.email}</Text>
                        
                        <Box>
                            <Text 
                              span 
                              style={{ cursor: "pointer", userSelect: "none" }} 
                              c="blue" 
                              onClick={() => setShowUserId(!showUserId)}
                              tabIndex={0} 
                              onKeyDown={(e) => { 
                                if (e.key === "Enter" || e.key === " ") setShowUserId(!showUserId); 
                              }}
                            >
                                {showUserId ? "Hide User ID" : "Show User ID (Support Purposes)"}
                            </Text>
                            {showUserId && (
                                <Group gap="xs" mt={4}>
                                    <Text size="sm">{user.id}</Text>
                                    <Tooltip label={clipboard.copied ? "Copied!" : "Copy"}>
                                      <ActionIcon 
                                        size="sm" 
                                        variant="subtle" 
                                        color={clipboard.copied ? "teal" : "blue"} 
                                        onClick={() => clipboard.copy(user.id)}
                                      >
                                        {clipboard.copied ? <CopiedIcon /> : <CopyIcon />}
                                      </ActionIcon>
                                    </Tooltip>
                                </Group>
                            )}
                        </Box>
                    </Stack>
                </Box>
            </Stack>
        </BasePage>
    )
}