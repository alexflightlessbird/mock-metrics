import React from "react";
import { useMantineTheme, ActionIcon } from "@mantine/core";
import icons from "../../utils/icons";

function EditIcon({ onClick }) {
  const theme = useMantineTheme();

  return (
    <ActionIcon
      variant="subtle"
      onClick={onClick}
      style={{ color: theme.colors.primaryBlue[0] }}
    >
      {React.createElement(icons.edit)}
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
    >
      {React.createElement(icons.delete)}
    </ActionIcon>
  );
}

export { EditIcon, DeleteIcon };
