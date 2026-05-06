import {
  Checkbox,
  Group,
  Paper,
  Stack,
  Text,
  Divider,
  Badge,
  ActionIcon,
  Box,
  ThemeIcon,
  Flex,
} from "@mantine/core";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { LuX, LuMic } from "react-icons/lu";

const SPEECH_TYPES = [
  { value: "open", label: "Open" },
  { value: "close", label: "Close" },
  { value: "none", label: "Middle" },
];

export default function SpeechFilter({ onFilterChange, initialFilters = [] }) {
  const [selectedSpeechTypes, setSelectedSpeechTypes] =
    useState(initialFilters);
  const isInitialMount = useRef(true);

  // Memoize the filter options
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
  }, [speechTypeOptions]);

  const handleClearAll = useCallback(() => {
    setSelectedSpeechTypes([]);
  }, []);

  const hasActiveFilters = selectedSpeechTypes.length > 0;
  const activeFilterCount = selectedSpeechTypes.length;

  // Memoize the filter object
  const filterValue = useMemo(
    () => ({
      speechTypes: selectedSpeechTypes,
    }),
    [selectedSpeechTypes],
  );

  const prevFilterValue = useRef(filterValue);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (
      JSON.stringify(prevFilterValue.current) !== JSON.stringify(filterValue)
    ) {
      prevFilterValue.current = filterValue;
      onFilterChange(filterValue);
    }
  }, [filterValue, onFilterChange]);

  const getSpeechLabel = (value) => {
    return SPEECH_TYPES.find((type) => type.value === value)?.label || value;
  };

  return (
    <Paper withBorder radius="md" style={{ overflow: "hidden" }}>
      <Box
        bg="var(--mantine-color-body)"
        style={{
          borderBottom: "1px solid var(--mantine-color-default-border)",
        }}
      >
        <Group justify="space-between" p="sm">
          <Group gap="xs">
            <ThemeIcon size="sm" variant="light" color="violet">
              <LuMic size={12} />
            </ThemeIcon>
            <Text size="sm" fw={600}>
              Filter by Speech
            </Text>
            {hasActiveFilters && (
              <Badge size="sm" color="violet" variant="filled" radius="sm">
                {activeFilterCount}
              </Badge>
            )}
          </Group>
          {hasActiveFilters && (
            <ActionIcon
              size="sm"
              variant="subtle"
              onClick={handleClearAll}
              color="gray"
            >
              <LuX size={14} />
            </ActionIcon>
          )}
        </Group>
      </Box>

      <Stack gap="md" p="sm">
        <Flex
          justify="space-between"
          direction="row-reverse"
          wrap="wrap"
          gap="md"
        >
          <Group justify="flex-end" gap="xs">
            <Text
              size="xs"
              c="violet"
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

          <Group gap="xl" wrap="wrap">
            {SPEECH_TYPES.map((type) => (
              <Checkbox
                key={type.value}
                label={
                  <Group gap="xs">
                    <Box>
                      <Text size="sm" fw={500}>
                        {type.label}
                      </Text>
                    </Box>
                  </Group>
                }
                checked={selectedSpeechTypes.includes(type.value)}
                onChange={() => handleSpeechTypeToggle(type.value)}
                size="sm"
              />
            ))}
          </Group>
        </Flex>
      </Stack>

      {/* Active Filters Summary - Same style as WitnessFilter */}
      {hasActiveFilters && (
        <Box
          p="xs"
          style={{
            backgroundColor: "var(--mantine-color-violet-0)",
            borderTop: "1px solid var(--mantine-color-violet-2)",
          }}
        >
          <Text size="xs" c="violet" fw={500}>
            Speech Types:{" "}
            {selectedSpeechTypes.map((t) => getSpeechLabel(t)).join(", ")}
          </Text>
        </Box>
      )}
    </Paper>
  );
}
