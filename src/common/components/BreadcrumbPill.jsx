import { Pill, useMantineTheme } from "@mantine/core";

export default function BreadcrumbPill({ active, children, ...props }) {
  const theme = useMantineTheme();

  const inactiveProps = {
    size: "md",
    style: {
      backgroundColor: theme.colors.lightGray[0],
      color: theme.colors.darkBlue[0],
      border: "1px solid " + theme.colors.darkBlue[0],
    },
  };

  const activeProps = {
    size: "lg",
    style: {
      backgroundColor: theme.colors.primaryBlue[0],
      color: theme.colors.darkBlue[0],
    },
  };

  const styles = active ? activeProps : inactiveProps;

  return (
    <Pill {...styles} {...props}>
      {children}
    </Pill>
  );
}
