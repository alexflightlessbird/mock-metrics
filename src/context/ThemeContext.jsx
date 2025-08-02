import { createContext, useContext } from "react";
import { useMantineColorScheme } from "@mantine/core";

const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const { setColorScheme, colorScheme } = useMantineColorScheme();

  const toggleTheme = () => {
    const newScheme = colorScheme === "dark" ? "light" : "dark";
    setColorScheme(newScheme);
  };

  return (
    <ThemeContext.Provider
      value={{ isDark: colorScheme === "dark", toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
