import { useState, useMemo, useEffect } from "react";
import { sortData } from "../utils/sortData";
import { Button, Space, Table, Tooltip } from "@mantine/core";
import SortableTh from "./SortableTh";
import {
  attorneyScoresByWitness,
  witnessScoresByWitness,
} from "../utils/mergeScoresforHover";
import { capitalize } from "../../../common/utils/helpers";
import { LuX } from "react-icons/lu";
import WitnessFilter from "./WitnessFilter";
import {
  filterAttorneysByWitness,
  filterWitnessesByWitness,
} from "../utils/filterByWitness";
import extractUniqueWitnesses from "../utils/extractUniqueWitnesses";
import { filterAttorneysBySpeech } from "../utils/filterBySpeech";
import SpeechFilter from "./SpeechFilter";

export default function ScoreTable({
  type,
  allScores,
  showTeam = false,
  scrollHeight = 500,
}) {
  const [sorting, setSorting] = useState({
    sortBy: null,
    reversed: false,
  });

  const [witnessFilters, setWitnessFilters] = useState({
    witnessTypes: [],
    witnessIds: [],
  });
  const [speechTypeFilters, setSpeechTypeFilters] = useState({
    speechTypes: [],
  });
  const [filteredScores, setFilteredScores] = useState(allScores);
  const [availableWitnesses, setAvailableWitnesses] = useState([]);

  const [filters, setFilters] = useState({
    name: "",
    teamName: "",
    side: "",
    average: "",
    averageDirect: "",
    averageCross: "",
    averageSpeech: "",
  });

  useEffect(() => {
    if (allScores && allScores.length > 0) {
      const witnesses = extractUniqueWitnesses(allScores, type);
      setAvailableWitnesses(witnesses);
    }
  }, [allScores, type]);

  useEffect(() => {
    if (!allScores) {
      setFilteredScores([]);
      return;
    }

    let filtered = allScores;

    if (
      witnessFilters.witnessTypes.length > 0 ||
      witnessFilters.witnessIds.length > 0
    ) {
      if (type === "attorney")
        filtered = filterAttorneysByWitness(allScores, witnessFilters);
      else if (type === "witness")
        filtered = filterWitnessesByWitness(allScores, witnessFilters);
    }

    if (speechTypeFilters.speechTypes.length > 0) {
      if (type === "attorney") {
        filtered = filterAttorneysBySpeech(filtered, speechTypeFilters);
      }
    }

    setFilteredScores(filtered);
  }, [allScores, witnessFilters, speechTypeFilters, type]);

  const handleWitnessFilterChange = (filters) => {
    setWitnessFilters(filters);
  };

  const handleSpeechTypeFilterChange = (filters) => {
    setSpeechTypeFilters(filters);
  };

  const handleSetSorting = (field) => {
    setSorting((prev) => ({
      reversed: field === prev.sortBy ? !prev.reversed : false,
      sortBy: field,
    }));
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const filteredData = useMemo(() => {
    if (!filteredScores) return [];

    return filteredScores.filter((student) => {
      if (
        filters.name &&
        !student.student.name.toLowerCase().includes(filters.name.toLowerCase())
      )
        return false;

      if (
        showTeam &&
        filters.teamName &&
        !student.teamName
          ?.toLowerCase()
          .includes(filters.teamName.toLowerCase())
      )
        return false;

      if (
        filters.side &&
        !student.side.toLowerCase().includes(filters.side.toLowerCase())
      )
        return false;

      if (filters.average) {
        const avgFilter = parseFloat(filters.average);
        if (isNaN(avgFilter) || student.average < avgFilter) return false;
      }

      if (filters.averageDirect) {
        const directFilter = parseFloat(filters.averageDirect);
        if (isNaN(directFilter) || student.averageDirect < directFilter)
          return false;
      }

      if (filters.averageCross) {
        const crossFilter = parseFloat(filters.averageCross);
        if (isNaN(crossFilter) || student.averageCross < crossFilter)
          return false;
      }

      if (type === "attorney" && filters.averageSpeech) {
        const speechFilter = parseFloat(filters.averageSpeech);
        if (isNaN(speechFilter) || student.averageSpeech < speechFilter)
          return false;
      }

      return true;
    });
  }, [filteredScores, filters, showTeam, type]);

  const sorted = sortData(filteredData, sorting.sortBy, sorting.reversed);

  const hasActiveFilters = Object.values(filters).some((f) => f !== "");

  const clearAllFilters = () => {
    setFilters({
      name: "",
      teamName: "",
      side: "",
      average: "",
      averageDirect: "",
      averageCross: "",
      averageSpeech: "",
    });
  };

  const TooltipCell = ({ score, tooltipContent, colored = true }) => {
    const lines = tooltipContent ? tooltipContent.split("\n") : [];

    const formattedLabel = tooltipContent
      ? lines.map((line, index) => (
          <div key={index}>
            {line}
            {index < lines.length - 1 && <br />}
          </div>
        ))
      : null;

    return (
      <Table.Td c={colored ? (score >= 0 ? undefined : "red") : undefined}>
        <Tooltip
          label={formattedLabel}
          withArrow
          position="top-start"
          arrowPosition="center"
          disabled={!tooltipContent}
          multiline
          width={220}
        >
          <span>{score}</span>
        </Tooltip>
      </Table.Td>
    );
  };

  const StudentRow = ({ student }) => {
    let scores = {
      directHover: {},
      crossHover: {},
      speechHover: {},
    };
    if (type === "attorney") {
      const { crossByWitness, directByWitness, speechByType } =
        attorneyScoresByWitness(student.scores);

      scores.directHover.display = directByWitness
        .sort((a, b) => b.average - a.average)
        .map(
          (d) =>
            `${d.witness.name}: ${d.average} (${d.rounds} round${
              d.rounds === 1 ? "" : "s"
            })`,
        )
        .join("\n");

      scores.crossHover.display = crossByWitness
        .sort((a, b) => b.average - a.average)
        .map(
          (c) =>
            `${c.witness.name}: ${c.average} (${c.rounds} round${
              c.rounds === 1 ? "" : "s"
            })`,
        )
        .join("\n");

      scores.speechHover.display = speechByType
        .sort((a, b) => b.average - a.average)
        .map(
          (s) =>
            `${capitalize(s.type) || "Unknown"}: ${s.average} (${s.rounds} round${
              s.rounds === 1 ? "" : "s"
            })`,
        )
        .join("\n");
    } else if (type === "witness") {
      const { directByWitness, crossByWitness } = witnessScoresByWitness(
        student.scores,
      );

      scores.directHover.display = directByWitness
        .sort((a, b) => b.average - a.average)
        .map(
          (d) =>
            `${d.witness.name}: ${d.average} (${d.rounds} round${
              d.rounds === 1 ? "" : "s"
            })`,
        )
        .join("\n");

      scores.crossHover.display = crossByWitness
        .sort((a, b) => b.average - a.average)
        .map(
          (c) =>
            `${c.witness.name}: ${c.average} (${c.rounds} round${
              c.rounds === 1 ? "" : "s"
            })`,
        )
        .join("\n");
    }

    return (
      <Table.Tr>
        <Table.Td>{student.student.name}</Table.Td>
        {showTeam && <Table.Td>{student.teamName}</Table.Td>}
        <Table.Td>{student.side.toUpperCase()}</Table.Td>
        <TooltipCell
          score={student.average}
          tooltipContent={`${student.scores.length} round${
            student.scores.length === 1 ? "" : "s"
          }`}
        />
        <TooltipCell
          score={student.averageDirect}
          tooltipContent={scores?.directHover?.display}
        />
        <TooltipCell
          score={student.averageCross}
          tooltipContent={scores?.crossHover?.display}
        />
        {type === "attorney" && (
          <TooltipCell
            score={student.averageSpeech}
            tooltipContent={scores?.speechHover?.display}
          />
        )}
      </Table.Tr>
    );
  };

  return (
    <>
      <WitnessFilter
        onFilterChange={handleWitnessFilterChange}
        availableWitnesses={availableWitnesses}
        initialTypeFilters={[]}
        initialWitnessFilters={[]}
      />

      {type === "attorney" && (
        <SpeechFilter
          onFilterChange={handleSpeechTypeFilterChange}
          initialFilters={[]}
        />
      )}

      <Space h="md" />

      {hasActiveFilters && (
        <Button
          variant="outline"
          size="xs"
          onClick={clearAllFilters}
          leftSection={<LuX />}
        >
          Clear all filters
        </Button>
      )}

      <Table.ScrollContainer
        minWidth={150}
        maxHeight={scrollHeight}
        type="scrollarea"
        style={{ border: "1px solid #dee2e6", borderRadius: 4 }}
      >
        <Table
          striped
          highlightOnHover
          style={{ userSelect: "none", WebkitUserSelect: "none" }}
          fz="xs"
          stickyHeader
        >
          <Table.Thead>
            <Table.Tr>
              <SortableTh
                sorted={sorting.sortBy === "student.name"}
                reversed={sorting.reversed}
                onSort={() => handleSetSorting("student.name")}
                filterable={true}
                filterValue={filters.name}
                onFilterChange={(value) => handleFilterChange("name", value)}
                filterPlaceholder="Filter by name..."
              >
                Name
              </SortableTh>
              {showTeam && (
                <SortableTh
                  sorted={sorting.sortBy === "teamName"}
                  reversed={sorting.reversed}
                  onSort={() => handleSetSorting("teamName")}
                  filterable={true}
                  filterValue={filters.teamName}
                  onFilterChange={(value) =>
                    handleFilterChange("teamName", value)
                  }
                  filterPlaceholder="Filter by team..."
                >
                  Team
                </SortableTh>
              )}
              <SortableTh
                sorted={sorting.sortBy === "side"}
                reversed={sorting.reversed}
                onSort={() => handleSetSorting("side")}
                filterable={true}
                filterValue={filters.side}
                onFilterChange={(value) => handleFilterChange("side", value)}
                filterPlaceholder="Filter by side (P/D)..."
              >
                Side
              </SortableTh>
              <SortableTh
                sorted={sorting.sortBy === "average"}
                reversed={sorting.reversed}
                onSort={() => handleSetSorting("average")}
                filterable={true}
                filterValue={filters.average}
                onFilterChange={(value) => handleFilterChange("average", value)}
                filterPlaceholder="Filter by minimum average..."
              >
                Average
              </SortableTh>
              <SortableTh
                sorted={sorting.sortBy === "averageDirect"}
                reversed={sorting.reversed}
                onSort={() => handleSetSorting("averageDirect")}
                filterable={true}
                filterValue={filters.averageDirect}
                onFilterChange={(value) =>
                  handleFilterChange("averageDirect", value)
                }
                filterPlaceholder="Filter by minimum direct average..."
              >
                Direct
              </SortableTh>
              <SortableTh
                sorted={sorting.sortBy === "averageCross"}
                reversed={sorting.reversed}
                onSort={() => handleSetSorting("averageCross")}
                filterable={true}
                filterValue={filters.averageCross}
                onFilterChange={(value) =>
                  handleFilterChange("averageCross", value)
                }
                filterPlaceholder="Filter by minimum cross average..."
              >
                Cross
              </SortableTh>
              {type === "attorney" && (
                <SortableTh
                  sorted={sorting.sortBy === "averageSpeech"}
                  reversed={sorting.reversed}
                  onSort={() => handleSetSorting("averageSpeech")}
                  filterable={true}
                  filterValue={filters.averageSpeech}
                  onFilterChange={(value) =>
                    handleFilterChange("averageSpeech", value)
                  }
                  filterPlaceholder="Filter by minimum speech average..."
                >
                  Speech
                </SortableTh>
              )}
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {sorted?.map((s) => (
              <StudentRow
                key={`${s.student.id}-${s.side}-${s.teamId}`}
                student={s}
              />
            ))}
            {sorted?.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={showTeam ? 7 : 6} c="dimmed" ta="center">
                  {hasActiveFilters
                    ? "No results match the current filters."
                    : "No data available."}
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </>
  );
}
