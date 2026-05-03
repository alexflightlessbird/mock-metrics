import { ActionIcon, Group, Table, TextInput, Popover } from "@mantine/core";
import {
  LuChevronDown,
  LuChevronsUpDown,
  LuChevronUp,
  LuFilter,
  LuX,
} from "react-icons/lu";
import { useTheme } from "../../../context/ThemeContext";
import { useState } from "react";

export default function SortableTh({
  children,
  reversed,
  sorted,
  onSort,
  filterable = false,
  filterValue = "",
  onFilterChange,
  filterPlaceholder = "Filter...",
}) {
  const Icon = sorted
    ? reversed
      ? LuChevronUp
      : LuChevronDown
    : LuChevronsUpDown;

  const { isDark } = useTheme();
  const [opened, setOpened] = useState(false);

  return (
    <Table.Th>
      <Group justify="space-between" align="center" gap="xs">
        <Group gap="xs" align="center" wrap="wrap">
          <span onClick={onSort} style={{ cursor: "pointer" }}>
            {children}
          </span>
          <Group align="center" wrap="nowrap" gap={0}>
            {filterable && (
              <Popover
                opened={opened}
                onClose={() => setOpened(false)}
                position="bottom"
                withArrow
                shadow="md"
              >
                <Popover.Target>
                  <ActionIcon
                    variant={filterValue ? "light" : "subtle"}
                    size="sm"
                    onClick={() => setOpened((o) => !o)}
                    color={filterValue ? "blue" : "gray"}
                  >
                    <LuFilter size={14} />
                  </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown>
                  <TextInput
                    placeholder={filterPlaceholder}
                    value={filterValue}
                    onChange={(e) => onFilterChange(e.target.value)}
                    size="xs"
                    rightSection={
                      filterValue && (
                        <ActionIcon
                          size="xs"
                          variant="subtle"
                          onClick={() => onFilterChange("")}
                        >
                          <LuX size={12} />
                        </ActionIcon>
                      )
                    }
                    autoFocus
                  />
                </Popover.Dropdown>
              </Popover>
            )}
            <ActionIcon
              variant={Icon != LuChevronsUpDown ? "light" : "subtle"}
              size="sm"
              onClick={onSort}
              color={Icon != LuChevronsUpDown ? "blue" : "gray"}
            >
              <Icon size={14} />
            </ActionIcon>
          </Group>
        </Group>
      </Group>
    </Table.Th>
  );
}
