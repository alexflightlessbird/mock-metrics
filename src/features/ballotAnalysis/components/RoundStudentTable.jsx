import { Table } from "@mantine/core";
import roundScores from "../utils/roundScores";

export default function RoundStudentTable({
  role_rounds,
  calculations,
  side,
  witness_rounds,
}) {
  const { attorneys: attorneyCalculations, witnesses: witnessCalculations } =
    roundScores({ role_rounds, calculations, side, witness_rounds });

  return (
    <Table
      striped
      highlightOnHover
      withTableBorder
      fz="xs"
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
    >
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Role</Table.Th>
          <Table.Th>Direct</Table.Th>
          <Table.Th>Cross</Table.Th>
          <Table.Th>Speech</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {attorneyCalculations.map((att) => (
          <Table.Tr key={att.student.id}>
            <Table.Td>{att.student.name}</Table.Td>
            <Table.Td>Attorney</Table.Td>
            <Table.Td>{att.calculations.direct.score}</Table.Td>
            <Table.Td>{att.calculations.cross.score}</Table.Td>
            <Table.Td>{att.calculations.speech.score}</Table.Td>
          </Table.Tr>
        ))}
        {witnessCalculations.map((wit) => (
          <Table.Tr key={wit.student.id}>
            <Table.Td>{wit.student.name}</Table.Td>
            <Table.Td>Witness</Table.Td>
            <Table.Td>{wit.calculations.direct.score}</Table.Td>
            <Table.Td>{wit.calculations.cross.score}</Table.Td>
            <Table.Td></Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
