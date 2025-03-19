import React from "react";
import Button from "antd/es/button";
import Tooltip from "antd/es/tooltip";
import icons from "../../../utils/icons";

export default function IconButton({
  icon,
  onClick,
  disabled = false,
  tooltip,
  tooltipText,
  tooltipPlacement = "top",
  buttonText = "Button",
  iconPosition = "start",
  open = false,
  className,
  shape = "default",
  size = "middle",
  type = "primary",
  color = "primary",
  danger = false,
  ghost = false,
  href,
  htmlType,
  loading = false,
  variant = "solid",
}) {
  const iconElement = icon && icons[icon] ? React.createElement(icons[icon]) : null;

  const buttonProps = {
    icon: iconElement,
    onClick,
    disabled,
    iconPosition,
    open,
    className,
    shape,
    size,
    type,
    color,
    danger,
    ghost,
    href,
    htmlType,
    loading,
    variant,
  }

  return (
    <>
      {tooltip ? (
        <Tooltip title={tooltipText} placement={tooltipPlacement}>
          <Button {...buttonProps}>{buttonText}</Button>
        </Tooltip>
      ) : (
        <Button {...buttonProps}>{buttonText}</Button>
      )}
    </>
  );
}
