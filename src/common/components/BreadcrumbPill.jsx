// Dependency imports
import { Pill, useMantineTheme } from "@mantine/core";

export default function BreadcrumbPill({ active, children, ...props }) {
  const theme = useMantineTheme();

  const inactiveProps = {
    size: "md",
    style: {
      backgroundColor: theme.colors.lightGray,
      color: theme.colors.darkBlue,
      border: "1px solid " + theme.colors.darkBlue,
    },
  };

  const activeProps = {
    size: "lg",
    style: {
      backgroundColor: theme.colors.primaryBlue,
      color: theme.colors.darkBlue,
    },
  };

  const styles = active ? activeProps : inactiveProps;

  return (
    <Pill {...styles} {...props}>
      {children}
    </Pill>
  );
}
