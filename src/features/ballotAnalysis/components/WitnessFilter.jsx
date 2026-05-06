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
  Box,
  ThemeIcon,
} from "@mantine/core";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { LuX, LuUsers, LuTag, LuFilter } from "react-icons/lu";

const WITNESS_TYPES = [
  { value: "expert", label: "Expert", color: "blue" },
  { value: "character", label: "Character", color: "green" },
  { value: "party rep", label: "Party Rep", color: "orange" },
  { value: "police/investigator", label: "Police/Investigator", color: "red" },
  { value: "other", label: "Other", color: "gray" },
];

export default function WitnessFilter({
  onFilterChange,
  availableWitnesses = [],
  initialTypeFilters = [],
  initialWitnessFilters = [],
}) {
  const [selectedTypes, setSelectedTypes] = useState(initialTypeFilters);
  const [selectedWitnesses, setSelectedWitnesses] = useState(
    initialWitnessFilters,
  );
  const [activeAccordion, setActiveAccordion] = useState(null);
  const isInitialMount = useRef(true);

  // Filter available witnesses based on selected types
  const filteredWitnessesByType = useMemo(() => {
    if (selectedTypes.length === 0) return availableWitnesses;
    return availableWitnesses.filter((witness) =>
      selectedTypes.includes(witness.type || "other"),
    );
  }, [selectedTypes, availableWitnesses]);

  // Group witnesses by type for better organization
  const witnessesByType = useMemo(() => {
    const grouped = {};
    filteredWitnessesByType.forEach((witness) => {
      const type = witness.type || "other";
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(witness);
    });
    return grouped;
  }, [filteredWitnessesByType]);

  // Memoize the filter object
  const filterValue = useMemo(
    () => ({
      witnessTypes: selectedTypes,
      witnessIds: selectedWitnesses,
    }),
    [selectedTypes, selectedWitnesses],
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

  // Clean up selected witnesses that are no longer available
  useEffect(() => {
    const availableWitnessIds = new Set(
      filteredWitnessesByType.map((w) => w.id),
    );
    const invalidWitnessIds = selectedWitnesses.filter(
      (id) => !availableWitnessIds.has(id),
    );
    if (invalidWitnessIds.length > 0) {
      setSelectedWitnesses((prev) =>
        prev.filter((id) => !invalidWitnessIds.includes(id)),
      );
    }
  }, [filteredWitnessesByType, selectedWitnesses]);

  const handleTypeToggle = useCallback((type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  }, []);

  const handleWitnessToggle = useCallback((witnessId) => {
    setSelectedWitnesses((prev) =>
      prev.includes(witnessId)
        ? prev.filter((id) => id !== witnessId)
        : [...prev, witnessId],
    );
  }, []);

  const handleSelectAllTypes = useCallback(() => {
    setSelectedTypes(WITNESS_TYPES.map((t) => t.value));
  }, []);

  const handleClearAllTypes = useCallback(() => {
    setSelectedTypes([]);
  }, []);

  const handleSelectAllWitnesses = useCallback(() => {
    setSelectedWitnesses(availableWitnesses.map((w) => w.id));
  }, [availableWitnesses]);

  const handleClearAllWitnesses = useCallback(() => {
    setSelectedWitnesses([]);
  }, []);

  const handleClearAllFilters = useCallback(() => {
    handleClearAllTypes();
    handleClearAllWitnesses();
  }, [handleClearAllTypes, handleClearAllWitnesses]);

  const hasActiveFilters =
    selectedTypes.length > 0 || selectedWitnesses.length > 0;
  const activeFilterCount = selectedTypes.length + selectedWitnesses.length;

  const getTypeLabel = useCallback((typeValue) => {
    return WITNESS_TYPES.find((t) => t.value === typeValue)?.label || typeValue;
  }, []);

  const getTypeColor = useCallback((typeValue) => {
    return WITNESS_TYPES.find((t) => t.value === typeValue)?.color || "gray";
  }, []);

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
            <ThemeIcon size="sm" variant="light" color="blue">
              <LuFilter size={12} />
            </ThemeIcon>
            <Text size="sm" fw={600}>
              Filter by Witness
            </Text>
            {hasActiveFilters && (
              <Badge size="sm" color="blue" variant="filled" radius="sm">
                {activeFilterCount}
              </Badge>
            )}
          </Group>
          {hasActiveFilters && (
            <ActionIcon
              size="sm"
              variant="subtle"
              onClick={handleClearAllFilters}
              color="gray"
            >
              <LuX size={14} />
            </ActionIcon>
          )}
        </Group>
      </Box>

      <Stack gap={0}>
        {/* Witness Types Section */}
        <Box
          style={{
            borderBottom:
              activeAccordion === "types"
                ? "none"
                : "1px solid var(--mantine-color-default-border)",
          }}
        >
          <Accordion
            variant="default"
            value={activeAccordion}
            onChange={setActiveAccordion}
          >
            <Accordion.Item value="types">
              <Accordion.Control icon={<LuTag size={16} />}>
                <Group justify="space-between" style={{ flex: 1 }}>
                  <Text size="sm" fw={500}>
                    Witness Types
                  </Text>
                  {selectedTypes.length > 0 && (
                    <Badge size="xs" color="blue" variant="light" radius="sm">
                      {selectedTypes.length} selected
                    </Badge>
                  )}
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack gap="md">
                  <Group justify="flex-end" gap="xs">
                    <Text
                      size="xs"
                      c="blue"
                      style={{ cursor: "pointer" }}
                      onClick={handleSelectAllTypes}
                    >
                      Select All
                    </Text>
                    <Divider orientation="vertical" />
                    <Text
                      size="xs"
                      c="red"
                      style={{ cursor: "pointer" }}
                      onClick={handleClearAllTypes}
                    >
                      Clear All
                    </Text>
                  </Group>
                  <Group gap="lg">
                    {WITNESS_TYPES.map((type) => (
                      <Checkbox
                        key={type.value}
                        label={
                          <Group gap="xs">
                            <Text size="sm">{type.label}</Text>
                            <Badge
                              size="xs"
                              color={type.color}
                              variant="light"
                              radius="sm"
                            >
                              {type.value}
                            </Badge>
                          </Group>
                        }
                        checked={selectedTypes.includes(type.value)}
                        onChange={() => handleTypeToggle(type.value)}
                        size="sm"
                      />
                    ))}
                  </Group>
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Box>

        {/* Specific Witnesses Section */}
        {availableWitnesses.length > 0 && (
          <Box>
            <Accordion
              variant="default"
              value={activeAccordion}
              onChange={setActiveAccordion}
            >
              <Accordion.Item value="witnesses">
                <Accordion.Control icon={<LuUsers size={16} />}>
                  <Group justify="space-between" style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>
                      Specific Witnesses
                    </Text>
                    <Group gap="xs">
                      {selectedTypes.length > 0 && (
                        <Badge
                          size="xs"
                          color="gray"
                          variant="light"
                          radius="sm"
                        >
                          Filtered by type
                        </Badge>
                      )}
                      {selectedWitnesses.length > 0 && (
                        <Badge
                          size="xs"
                          color="blue"
                          variant="light"
                          radius="sm"
                        >
                          {selectedWitnesses.length} selected
                        </Badge>
                      )}
                    </Group>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="md">
                    <Group justify="flex-end" gap="xs">
                      <Text
                        size="xs"
                        c="blue"
                        style={{ cursor: "pointer" }}
                        onClick={handleSelectAllWitnesses}
                      >
                        Select All
                      </Text>
                      <Divider orientation="vertical" />
                      <Text
                        size="xs"
                        c="red"
                        style={{ cursor: "pointer" }}
                        onClick={handleClearAllWitnesses}
                      >
                        Clear All
                      </Text>
                    </Group>
                    {filteredWitnessesByType.length === 0 ? (
                      <Box
                        p="xl"
                        style={{
                          textAlign: "center",
                          backgroundColor: "var(--mantine-color-gray-0)",
                        }}
                        radius="md"
                      >
                        <Text size="sm" c="dimmed">
                          No witnesses match the selected type
                          {selectedTypes.length > 1 ? "s" : ""}
                        </Text>
                      </Box>
                    ) : (
                      <ScrollArea type="auto" h={300}>
                        <Stack gap="md">
                          {Object.entries(witnessesByType).map(
                            ([type, witnesses]) => (
                              <Box key={type}>
                                <Group gap="xs" mb="xs">
                                  <ThemeIcon
                                    size="xs"
                                    radius="xl"
                                    color={getTypeColor(type)}
                                    variant="light"
                                  >
                                    <div
                                      style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: "50%",
                                        backgroundColor: "currentColor",
                                      }}
                                    />
                                  </ThemeIcon>
                                  <Text
                                    size="xs"
                                    fw={600}
                                    c="dimmed"
                                    tt="capitalize"
                                  >
                                    {getTypeLabel(type)}
                                  </Text>
                                  <Badge size="xs" variant="light" radius="sm">
                                    {witnesses.length}
                                  </Badge>
                                </Group>
                                <Stack gap="xs" pl="md">
                                  {witnesses.map((witness) => (
                                    <Checkbox
                                      key={witness.id}
                                      label={
                                        <Group gap="xs">
                                          <Text size="sm">{witness.name}</Text>
                                          <Badge
                                            size="xs"
                                            color={
                                              witness.side === "p"
                                                ? "blue"
                                                : "red"
                                            }
                                            variant="light"
                                            radius="sm"
                                          >
                                            {witness.side?.toUpperCase()}
                                          </Badge>
                                        </Group>
                                      }
                                      checked={selectedWitnesses.includes(
                                        witness.id,
                                      )}
                                      onChange={() =>
                                        handleWitnessToggle(witness.id)
                                      }
                                      size="sm"
                                    />
                                  ))}
                                </Stack>
                              </Box>
                            ),
                          )}
                        </Stack>
                      </ScrollArea>
                    )}
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Box>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <Box
            p="xs"
            style={{
              backgroundColor: "var(--mantine-color-blue-0)",
              borderTop: "1px solid var(--mantine-color-blue-2)",
            }}
          >
            <Text size="xs" c="blue" fw={500}>
              {selectedTypes.length > 0 && (
                <>
                  Types: {selectedTypes.map((t) => getTypeLabel(t)).join(", ")}
                </>
              )}
              {selectedTypes.length > 0 && selectedWitnesses.length > 0 && (
                <span> • </span>
              )}
              {selectedWitnesses.length > 0 && (
                <>
                  {selectedWitnesses.length} witness
                  {selectedWitnesses.length === 1 ? "" : "es"} selected
                </>
              )}
            </Text>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
