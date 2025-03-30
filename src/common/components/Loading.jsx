import { Loader, useMantineTheme } from "@mantine/core";

export default function Loading() {
  const theme = useMantineTheme();

  setTimeout(() => {
    return (
      <Loader
        className="main-loading"
        color={theme.colors.primaryBlue[0]}
        type="bars"
      />
    );
  }, 700);
}
