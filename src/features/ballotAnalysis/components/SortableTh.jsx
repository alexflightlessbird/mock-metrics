import { ActionIcon, Group, Table } from "@mantine/core";
import { LuChevronDown, LuChevronsUpDown, LuChevronUp } from "react-icons/lu";
import { useTheme } from "../../../context/ThemeContext";

export default function SortableTh({ children, reversed, sorted, onSort }) {
  const Icon = sorted
    ? reversed
      ? LuChevronUp
      : LuChevronDown
    : LuChevronsUpDown;

  const { isDark } = useTheme();

  return (
    <Table.Th>
      <Group
        justify="space-between"
        align="center"
        onClick={onSort}
        style={{ cursor: "pointer" }}
      >
        {children}
        <ActionIcon variant="transparent" c={isDark ? "white" : "dark"}>
          <Icon />
        </ActionIcon>
      </Group>
    </Table.Th>
  );
}
