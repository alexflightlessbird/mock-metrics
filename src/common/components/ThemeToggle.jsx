import { useTheme } from "../../context/ThemeContext";
import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { LuSun as SunIcon, LuMoon as MoonIcon } from "react-icons/lu";

export default function ThemeToggle({ mobileSize = false }) {
  const { colorScheme } = useMantineColorScheme();
  const { toggleTheme } = useTheme();
  const dark = colorScheme === "dark";

  return (
    <ActionIcon
      variant="outline"
      color={dark ? "yellow" : "blue"}
      onClick={toggleTheme}
      title="Toggle color scheme"
      size={mobileSize ? "lg" : "md"}
      fz={mobileSize ? "lg" : "md"}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </ActionIcon>
  );
}
