import {
  Flex,
  Select,
  TextInput,
  ActionIcon,
  Button,
  Space,
} from "@mantine/core";
import {
  LuSearch as SearchIcon,
  LuPlus as PlusIcon,
  LuRefreshCw as RefreshIcon,
  LuX as XIcon,
} from "react-icons/lu";
import { useViewportSize } from "@mantine/hooks";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  columns = [],
  selectedColumn,
  onColumnChange,
  resetEnabled = true,
  onReset,
  addEnabled = false,
  onAdd,
  addName,
}) {
  const { width } = useViewportSize();

  const handleClear = () => {
    onChange("");
  };

  return (
    <>
      <Flex gap="xs" mt="md" align="center">
        <TextInput
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          leftSection={<SearchIcon />}
          flex={1}
          rightSection={
            value ? (
              <ActionIcon c="gray" variant="transparent" onClick={handleClear}>
                <XIcon />
              </ActionIcon>
            ) : null
          }
        />
        {columns.length > 0 && (
          <Select
            placeholder="All"
            data={[{ value: "all", label: "All" }, ...columns]}
            value={selectedColumn}
            onChange={onColumnChange}
            allowDeselect={false}
            w="20%"
          />
        )}
        {resetEnabled && (
          <ActionIcon onClick={onReset} size="lg">
            <RefreshIcon />
          </ActionIcon>
        )}
        {addEnabled && (width > 450 || (width <= 450 && !resetEnabled)) && (
          <ActionIcon onClick={onAdd} size="lg">
            <PlusIcon />
          </ActionIcon>
        )}
      </Flex>
      {addEnabled && width <= 450 && resetEnabled && (
        <Button onClick={onAdd} fullWidth mt="xs">
          Add{addName ? " " + addName : ""}
        </Button>
      )}
      <Space h="md" />
    </>
  );
}
