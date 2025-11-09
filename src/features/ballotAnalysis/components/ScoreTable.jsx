import { useState } from "react";
import { sortData } from "../utils/sortData";
import { Table, Tooltip } from "@mantine/core";
import SortableTh from "./SortableTh";
import {
  attorneyScoresByWitness,
  witnessScoresByWitness,
} from "../utils/mergeScoresforHover";
import { capitalize } from "../../../common/utils/helpers";

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

  const sorted = sortData(allScores, sorting.sortBy, sorting.reversed);

  const handleSetSorting = (field) => {
    setSorting((prev) => ({
      reversed: field === prev.sortBy ? !prev.reversed : false,
      sortBy: field,
    }));
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
            })`
        )
        .join("\n");

      scores.crossHover.display = crossByWitness
        .sort((a, b) => b.average - a.average)
        .map(
          (c) =>
            `${c.witness.name}: ${c.average} (${c.rounds} round${
              c.rounds === 1 ? "" : "s"
            })`
        )
        .join("\n");

      scores.speechHover.display = speechByType
        .sort((a, b) => b.average - a.average)
        .map(
          (s) =>
            `${capitalize(s.type)}: ${s.average} (${s.rounds} round${
              s.rounds === 1 ? "" : "s"
            })`
        )
        .join("\n");
    } else if (type === "witness") {
      const { directByWitness, crossByWitness } = witnessScoresByWitness(
        student.scores
      );

      scores.directHover.display = directByWitness
        .sort((a, b) => b.average - a.average)
        .map(
          (d) =>
            `${d.witness.name}: ${d.average} (${d.rounds} round${
              d.rounds === 1 ? "" : "s"
            })`
        )
        .join("\n");

      scores.crossHover.display = crossByWitness
        .sort((a, b) => b.average - a.average)
        .map(
          (c) =>
            `${c.witness.name}: ${c.average} (${c.rounds} round${
              c.rounds === 1 ? "" : "s"
            })`
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
    <Table.ScrollContainer
      minWidth={150}
      maxHeight={scrollHeight}
      type="scrollarea"
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
            >
              Name
            </SortableTh>
            {showTeam && (
              <SortableTh
                sorted={sorting.sortBy === "teamName"}
                reversed={sorting.reversed}
                onSort={() => handleSetSorting("teamName")}
              >
                Team
              </SortableTh>
            )}
            <Table.Th>Side</Table.Th>
            <SortableTh
              sorted={sorting.sortBy === "average"}
              reversed={sorting.reversed}
              onSort={() => handleSetSorting("average")}
            >
              Average
            </SortableTh>
            <SortableTh
              sorted={sorting.sortBy === "averageDirect"}
              reversed={sorting.reversed}
              onSort={() => handleSetSorting("averageDirect")}
            >
              Direct
            </SortableTh>
            <SortableTh
              sorted={sorting.sortBy === "averageCross"}
              reversed={sorting.reversed}
              onSort={() => handleSetSorting("averageCross")}
            >
              Cross
            </SortableTh>
            {type === "attorney" && (
              <SortableTh
                sorted={sorting.sortBy === "averageSpeech"}
                reversed={sorting.reversed}
                onSort={() => handleSetSorting("averageSpeech")}
              >
                Speech
              </SortableTh>
            )}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {sorted.map((s) => (
            <StudentRow
              key={`${s.student.id}-${s.side}-${s.teamId}`}
              student={s}
            />
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
