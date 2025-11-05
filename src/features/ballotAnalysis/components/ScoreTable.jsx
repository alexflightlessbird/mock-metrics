import { useState } from "react";
import { sortData } from "../utils/sortData";
import { Table } from "@mantine/core";
import SortableTh from "./SortableTh";

export default function ScoreTable({ 
    type, 
    allScores, 
    showTeam = false, 
    scrollHeight = 500 
}) {
    const [sorting, setSorting] = useState({
        sortBy: null,
        reversed: false,
    });

    const sorted = sortData(allScores, sorting.sortBy, sorting.reversed);

    const handleSetSorting = (field) => {
        setSorting(prev => ({
            reversed: field === prev.sortBy ? !prev.reversed : false,
            sortBy: field,
        }));
    };

    const ColoredRow = ({ score }) => {
        return <Table.Td c={score >= 0 ? undefined : "red"}>{score}</Table.Td>
    }

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
                    {sorted.map(s => (
                        <Table.Tr key={`${s.student.id}-${s.side}`}>
                            <Table.Td>{s.student.name}</Table.Td>
                            {showTeam && <Table.Td>{s.teamName}</Table.Td>}
                            <Table.Td>{s.side.toUpperCase()}</Table.Td>
                            <ColoredRow score={s.average} />
                            <ColoredRow score={s.averageDirect} />
                            <ColoredRow score={s.averageCross} />
                            {type === "attorney" && <ColoredRow score={s.averageSpeech} />}
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}