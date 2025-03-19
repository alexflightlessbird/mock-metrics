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
  tooltipPlacement,
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
  if (icon && icons[icon]) {
    icon = React.createElement(icons[icon]);
  } else if (icon) throw new Error("Invalid icon name");

  return (
    <>
      {tooltip ? (
        <Tooltip title={tooltipText} placement={tooltipPlacement}>
          <Button
            onClick={onClick}
            disabled={disabled}
            icon={icon}
            iconPosition={iconPosition}
            open={open}
            className={className}
            shape={shape}
            size={size}
            type={type}
            color={color}
            danger={danger}
            ghost={ghost}
            href={href}
            htmlType={htmlType}
            loading={loading}
            variant={variant}
          >
            {buttonText}
          </Button>
        </Tooltip>
      ) : (
        <Button
          onClick={onClick}
          disabled={disabled}
          icon={icon}
          iconPosition={iconPosition}
          className={className}
          shape={shape}
          size={size}
          type={type}
          color={color}
          danger={danger}
          ghost={ghost}
          href={href}
          htmlType={htmlType}
          loading={loading}
          variant={variant}
        >
          {buttonText}
        </Button>
      )}
    </>
  );
}
