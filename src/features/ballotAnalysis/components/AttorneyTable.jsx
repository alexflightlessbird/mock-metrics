import { useState } from "react";
import { sortData } from "../utils/sortData";
import { Table } from "@mantine/core";
import SortableTh from "./SortableTh";

export default function AttorneyTable({ allScores, showTeam = false }) {
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
    <Table.ScrollContainer minWidth={150} maxHeight={500} type="scrollarea">
      <Table
        striped
        highlightOnHover
        style={{ userSelect: "none", WebkitUserSelect: "none" }}
        fz="sm"
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
            <SortableTh
              sorted={sorting.sortBy === "averageSpeech"}
              reversed={sorting.reversed}
              onSort={() => handleSetSorting("averageSpeech")}
            >
              Speech
            </SortableTh>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sorted.map((att) => (
            <Table.Tr key={`${att.student.id}-${att.side}`}>
              <Table.Td>{att.student.name}</Table.Td>
              {showTeam && <Table.Td>{att.teamName}</Table.Td>}
              <Table.Td>{att.side.toUpperCase()}</Table.Td>
              <ColoredRow score={att.average} />
              <ColoredRow score={att.averageDirect} />
              <ColoredRow score={att.averageCross} />
              <ColoredRow score={att.averageSpeech} />
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
