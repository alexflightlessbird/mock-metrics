// Dependency imports
import { createElement } from "react";
import { useMantineTheme, ActionIcon } from "@mantine/core";

// Utils imports
import icons from "../../utils/icons";

function ActionIconComp ({ onClick, color, colorLoc = 0, icon, fontSize = "xl" }) {
  const theme = useMantineTheme();

  return (
    <ActionIcon
      variant="subtle"
      onClick={onClick}
      style={{ color: theme.colors[color][colorLoc] }}
      fz={fontSize}
    >
      {createElement(icons[icon])}
    </ActionIcon>
  )
}

export function EditIcon({ onClick }) {
  return <ActionIconComp onClick={onClick} color="primaryBlue" icon="edit" />;
}

export function DeleteIcon({ onClick }) {
  return <ActionIconComp onClick={onClick} color="errorRed" icon="delete" />;
}

export function AddIcon({ onClick }) {
  return <ActionIconComp onClick={onClick} color="primaryBlue" icon="add" />;
}