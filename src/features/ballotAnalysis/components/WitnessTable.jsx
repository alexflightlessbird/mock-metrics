import { useState } from "react";
import { sortData } from "../utils/sortData";
import { Table } from "@mantine/core";
import SortableTh from "./SortableTh";

export default function WitnessTable({
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

  const ColoredRow = ({ score }) => {
    return <Table.Td c={score >= 0 ? undefined : "red"}>{score}</Table.Td>;
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
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sorted.map((wit) => (
            <Table.Tr key={`${wit.student.id}-${wit.side}`}>
              <Table.Td>{wit.student.name}</Table.Td>
              {showTeam && <Table.Td>{wit.teamName}</Table.Td>}
              <Table.Td>{wit.side.toUpperCase()}</Table.Td>
              <ColoredRow score={wit.average} />
              <ColoredRow score={wit.averageDirect} />
              <ColoredRow score={wit.averageCross} />
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
