import { ActionIcon, Tooltip } from "@mantine/core";
import { LuArchive, LuArchiveRestore } from "react-icons/lu";

export default function ArchiveAction({
  isActive,
  onArchive,
  onUnarchive,
  archiveLabel = "Archive",
  unarchiveLabel = "Unarchive",
  size = "sm",
  ...props
}) {
  const handleClick = isActive ? onArchive : onUnarchive;
  const label = isActive ? archiveLabel : unarchiveLabel;
  const Icon = isActive ? LuArchive : LuArchiveRestore;

  return (
    <Tooltip label={label} withArrow>
      <ActionIcon variant="subtle" onClick={handleClick} size={size} {...props}>
        <Icon />
      </ActionIcon>
    </Tooltip>
  );
}
