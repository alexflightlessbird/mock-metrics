// Dependency imports
import { createElement } from "react";
import { Button, useMantineTheme } from "@mantine/core";

// Utils imports
import icons from "../../utils/icons";

export default function IconButton({
  icon = null,
  iconPosition = "left",
  buttonText = "",
  variant = "filled",
  color,
  type = "button",
  onClick,
  fontColor,
}) {
  const theme = useMantineTheme();

  let iconProps;

  if (icon) {
    if (iconPosition === "right") {
      iconProps = {
        rightSection: createElement(icons[icon]),
      };
    } else {
      iconProps = {
        leftSection: createElement(icons[icon]),
      };
    }
  }

  return (
    <Button
      variant={variant}
      {...iconProps}
      color={color || theme.colors.primaryBlue[0]}
      style={{ color: fontColor || "white" }}
      type={type}
      onClick={onClick}
    >
      {buttonText}
    </Button>
  );
}
