// Dependency imports
import { createElement } from "react";
import { Button, useMantineTheme } from "@mantine/core";

// Utils imports
import icons from "../../utils/icons";
import styles from "../../assets/styles/IconButton.module.css";

export default function IconButton({
  icon = null,
  iconPosition = "left",
  buttonText = "",
  variant = "filled",
  disabled = false,
  color,
  type = "button",
  onClick,
  fontColor,
  ...otherProps
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
      className={disabled ? styles.disabled : styles.regular}
      variant={disabled ? "outline" : variant}
      {...iconProps}
      color={color || theme.colors.primaryBlue[0]}
      style={{ color: fontColor || "white" }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      {...otherProps}
    >
      {buttonText}
    </Button>
  );
}
