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

const WITNESS_TYPES = [
  { value: "expert", label: "Expert" },
  { value: "character", label: "Character" },
  { value: "party rep", label: "Party Rep" },
  { value: "police/investigator", label: "Police/Investigator" },
  { value: "other", label: "Other" },
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
  const [typesOpen, setTypesOpen] = useState(false);
  const [witnessesOpen, setWitnessesOpen] = useState(false);
  const isInitialMount = useRef(true);

  // Group witnesses by type for better organization
  const witnessesByType = useMemo(() => {
    const grouped = {};
    availableWitnesses.forEach((witness) => {
      const type = witness.type || "other";
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(witness);
    });
    return grouped;
  }, [availableWitnesses]);

  // Memoize the filter object to prevent unnecessary re-renders
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

  return (
    <Paper withBorder p="sm" radius="md">
      <Stack gap="xs">
        <Group justify="space-between">
          <Group gap="xs">
            <Text size="sm" fw={500}>
              Filter by Witness
            </Text>
            {hasActiveFilters && (
              <Badge size="xs" color="blue" variant="light">
                {activeFilterCount} active
              </Badge>
            )}
          </Group>
          {hasActiveFilters && (
            <Tooltip label="Clear all witness filters">
              <ActionIcon
                size="sm"
                variant="subtle"
                onClick={handleClearAllFilters}
              >
                <LuX size={14} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>

        <Divider />

        <Accordion
          variant="separated"
          value={typesOpen ? "types" : null}
          onChange={() => setTypesOpen(!typesOpen)}
        >
          <Accordion.Item value="types">
            <Accordion.Control>
              <Group justify="space-between" w="100%">
                <Text size="sm">By Witness Type</Text>
                {selectedTypes.length > 0 && (
                  <Badge size="xs" color="blue">
                    {selectedTypes.length} selected
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
                <Group gap="md">
                  {WITNESS_TYPES.map((type) => (
                    <Checkbox
                      key={type.value}
                      label={type.label}
                      checked={selectedTypes.includes(type.value)}
                      onChange={() => handleTypeToggle(type.value)}
                      size="xs"
                    />
                  ))}
                </Group>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        {availableWitnesses.length > 0 && (
          <>
            <Divider />
            <Accordion
              variant="separated"
              value={witnessesOpen ? "witnesses" : null}
              onChange={() => setWitnessesOpen(!witnessesOpen)}
            >
              <Accordion.Item value="witnesses">
                <Accordion.Control>
                  <Group justify="space-between" w="100%">
                    <Text size="sm">By Specific Witness</Text>
                    {selectedWitnesses.length > 0 && (
                      <Badge size="xs" color="blue">
                        {selectedWitnesses.length} selected
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
                    <ScrollArea h={300} type="auto">
                      <Stack gap="xs">
                        {Object.entries(witnessesByType).map(
                          ([type, witnesses]) => (
                            <Stack key={type} gap="xs">
                              <Text
                                size="xs"
                                fw={600}
                                c="dimmed"
                                tt="capitalize"
                              >
                                {getTypeLabel(type)}
                              </Text>
                              {witnesses.map((witness) => (
                                <Checkbox
                                  key={witness.id}
                                  label={
                                    <Group gap="xs">
                                      <Text size="xs">{witness.name}</Text>
                                      <Badge
                                        size="xs"
                                        color="gray"
                                        variant="light"
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
                                  size="xs"
                                  pl="md"
                                />
                              ))}
                            </Stack>
                          ),
                        )}
                      </Stack>
                    </ScrollArea>
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </>
        )}

        {hasActiveFilters && (
          <Stack gap="xs" mt="xs">
            <Divider />
            <Text size="xs" c="dimmed">
              {selectedTypes.length > 0 && (
                <span>
                  Filtering by type{selectedTypes.length > 1 ? "s" : ""}:{" "}
                  {selectedTypes.map((t) => getTypeLabel(t)).join(", ")}
                </span>
              )}
              {selectedTypes.length > 0 && selectedWitnesses.length > 0 && (
                <span> and </span>
              )}
              {selectedWitnesses.length > 0 && (
                <span>
                  filtering {selectedWitnesses.length} specific witness
                  {selectedWitnesses.length === 1 ? "" : "es"}
                </span>
              )}
            </Text>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
