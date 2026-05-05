import {
  Checkbox,
  Group,
  Paper,
  Stack,
  Text,
  Divider,
  Accordion,
  ScrollArea,
  Badge,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { LuX, LuChevronDown, LuChevronUp } from "react-icons/lu";

const SPEECH_TYPES = [
  { value: "close", label: "Close" },
  { value: "open", label: "Open" },
];

export default function SpeechFilter({ onFilterChange, initialFilters = [] }) {
  const [selectedSpeechTypes, setSelectedSpeechTypes] =
    useState(initialFilters);
  const [isOpen, setIsOpen] = useState(false);

  // Memoize the filter options to prevent unnecessary re-renders
  const speechTypeOptions = useMemo(
    () =>
      SPEECH_TYPES.map((type) => ({
        value: type.value,
        label: type.label,
      })),
    [],
  );

  const handleSpeechTypeToggle = useCallback((type) => {
    setSelectedSpeechTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedSpeechTypes(speechTypeOptions.map((option) => option.value));
  });

  const handleClearAll = useCallback(() => {
    setSelectedSpeechTypes([]);
  }, []);

  const hasActiveFilters = selectedSpeechTypes.length > 0;
  const activeFilterCount = selectedSpeechTypes.length;

  // Memoize the filter object to prevent unnecessary re-renders
  const filterValue = useMemo(
    () => ({
      speechTypes: selectedSpeechTypes,
    }),
    [selectedSpeechTypes],
  );

  const prevFilterValue = useRef(filterValue);

  useEffect(() => {
    if (
      JSON.stringify(prevFilterValue.current) !== JSON.stringify(filterValue)
    ) {
      prevFilterValue.current = filterValue;
      onFilterChange(filterValue);
    }
  }, [filterValue, onFilterChange]);

  return (
    <Paper withBorder p="sm" radius="md">
      <Stack gap="xs">
        <Group justify="space-between">
          <Group gap="xs">
            <Text size="sm" fw={500}>
              Filter by Speech
            </Text>
            {hasActiveFilters && (
              <Badge size="xs" color="blue" variant="light">
                {activeFilterCount} active
              </Badge>
            )}
          </Group>
          {hasActiveFilters && (
            <Tooltip label="Clear all filters">
              <ActionIcon size="sm" variant="subtle" onClick={handleClearAll}>
                <LuX size={14} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>

        <Divider />

        <Accordion
          variant="separated"
          value={isOpen ? "open" : null}
          onChange={() => setIsOpen(!isOpen)}
        >
          <Accordion.Item value="open">
            <Accordion.Control>
              <Group justify="space-between" w="100%">
                <Text size="sm">By Speech Type</Text>
                {selectedSpeechTypes.length > 0 && (
                  <Badge size="xs" color="blue">
                    {selectedSpeechTypes.length} selected
                  </Badge>
                )}
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="xs">
                <Group justify="flex-end">
                  <Text
                    size="xs"
                    c="blue"
                    style={{ cursor: "pointer" }}
                    onClick={handleSelectAll}
                  >
                    Select All
                  </Text>
                  <Divider orientation="vertical" />
                  <Text
                    size="xs"
                    c="red"
                    style={{ cursor: "pointer" }}
                    onClick={handleClearAll}
                  >
                    Clear All
                  </Text>
                </Group>
                <Group gap="md">
                  {SPEECH_TYPES.map((type) => (
                    <Checkbox
                      key={type.value}
                      label={type.label}
                      checked={selectedSpeechTypes.includes(type.value)}
                      onChange={() => handleSpeechTypeToggle(type.value)}
                      size="xs"
                    />
                  ))}
                </Group>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Stack>
    </Paper>
  );
}
