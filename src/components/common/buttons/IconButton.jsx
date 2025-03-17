import { Button, Tooltip } from "antd";

export default function IconButton({
  icon,
  onClick,
  disabled,
  tooltip,
  tooltipText,
  tooltipPlacement,
  buttonText,
  iconPosition = "start",
  open = false,
  className,
}) {
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
        >
          {buttonText}
        </Button>
      )}
    </>
  );
}
