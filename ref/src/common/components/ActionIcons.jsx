// Dependency imports
import { createElement } from "react";
import { useMantineTheme, ActionIcon } from "@mantine/core";

// Utils imports
import icons from "../../utils/icons";

function ActionIconComp ({ onClick, color, colorLoc, icon, fontSize = "xl" }) {
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

export function EditIcon({ onClick, color = "primaryBlue", colorLoc = 0 }) {
  return <ActionIconComp onClick={onClick} color={color} colorLoc={colorLoc} icon="edit" />;
}

export function DeleteIcon({ onClick, color = "errorRed", colorLoc = 0 }) {
  return <ActionIconComp onClick={onClick} color={color} colorLoc={colorLoc} icon="delete" />;
}

export function AddIcon({ onClick, color = "primaryBlue", colorLoc = 0 }) {
  return <ActionIconComp onClick={onClick} color={color} colorLoc={colorLoc} icon="add" />;
}