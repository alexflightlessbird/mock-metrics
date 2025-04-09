// Dependency imports
import { createElement } from "react";
import { useMantineTheme, ActionIcon } from "@mantine/core";

// Utils imports
import icons from "../../utils/icons";

function EditIcon({ onClick }) {
  const theme = useMantineTheme();

  return (
    <ActionIcon
      variant="subtle"
      onClick={onClick}
      style={{ color: theme.colors.primaryBlue[0] }}
      fz="xl"
    >
      {createElement(icons.edit)}
    </ActionIcon>
  );
}

function DeleteIcon({ onClick }) {
  const theme = useMantineTheme();

  return (
    <ActionIcon
      variant="subtle"
      onClick={onClick}
      style={{ color: theme.colors.red[5] }}
      fz="xl"
    >
      {createElement(icons.delete)}
    </ActionIcon>
  );
}

function AddIcon({ onClick }) {
  const theme = useMantineTheme();

  return (
    <ActionIcon
      variant="subtle"
      onClick={onClick}
      style={{ color: theme.colors.primaryBlue[0] }}
      fz="xl"
    >
      {createElement(icons.add)}
    </ActionIcon>
  );
}

export { EditIcon, DeleteIcon, AddIcon };
