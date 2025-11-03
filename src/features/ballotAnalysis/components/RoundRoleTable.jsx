import { Table } from "@mantine/core";
import {
  attorneyCrossesHelpers,
  attorneyDirectsHelpers,
  findAttorneyCrossesWitnesses,
  findAttorneyDirectsWitnesses,
  findClosingAttorney,
  findMiddleAttorney,
  findOpeningAttorney,
} from "../utils/filterRoles";

export default function RoundRoleTable({ role_rounds, witness_rounds, side }) {
  const openingAttorney = findOpeningAttorney({ role_rounds, side })?.student;
  const closingAttorney = findClosingAttorney({ role_rounds, side })?.student;
  const middleAttorney = findMiddleAttorney({ role_rounds, side })?.student;

  const attorneyDirectsWitnesses = findAttorneyDirectsWitnesses({
    role_rounds,
    witness_rounds,
    side,
  });
  const attorneyCrossesWitnesses = findAttorneyCrossesWitnesses({
    role_rounds,
    witness_rounds,
    side,
  });

  const openingHelpers = {
    direct: attorneyDirectsHelpers({
      attorneyDirectsWitnesses,
      attorneyId: openingAttorney?.id,
    }),
    cross: attorneyCrossesHelpers({
      attorneyCrossesWitnesses,
      attorneyId: openingAttorney?.id,
    }),
  };
  const middleHelpers = {
    direct: attorneyDirectsHelpers({
      attorneyDirectsWitnesses,
      attorneyId: middleAttorney?.id,
    }),
    cross: attorneyCrossesHelpers({
      attorneyCrossesWitnesses,
      attorneyId: middleAttorney?.id,
    }),
  };
  const closingHelpers = {
    direct: attorneyDirectsHelpers({
      attorneyDirectsWitnesses,
      attorneyId: closingAttorney?.id,
    }),
    cross: attorneyCrossesHelpers({
      attorneyCrossesWitnesses,
      attorneyId: closingAttorney?.id,
    }),
  };

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
          <Table.Th></Table.Th>
          <Table.Th>Attorney</Table.Th>
          <Table.Th>Direct</Table.Th>
          <Table.Th>Played by</Table.Th>
          <Table.Th>Direct Order</Table.Th>
          <Table.Th>Cross</Table.Th>
          <Table.Th>Cross Order</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          <Table.Td>O</Table.Td>
          <Table.Td>{openingAttorney.name}</Table.Td>
          <Table.Td>{openingHelpers.direct.witnessName}</Table.Td>
          <Table.Td>{openingHelpers.direct.witnessStudentName}</Table.Td>
          <Table.Td>{openingHelpers.direct.directOrder}</Table.Td>
          <Table.Td>{openingHelpers.cross.witnessName}</Table.Td>
          <Table.Td>{openingHelpers.cross.crossOrder}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Td>M</Table.Td>
          <Table.Td>{middleAttorney.name}</Table.Td>
          <Table.Td>{middleHelpers.direct.witnessName}</Table.Td>
          <Table.Td>{middleHelpers.direct.witnessStudentName}</Table.Td>
          <Table.Td>{middleHelpers.direct.directOrder}</Table.Td>
          <Table.Td>{middleHelpers.cross.witnessName}</Table.Td>
          <Table.Td>{middleHelpers.cross.crossOrder}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Td>C</Table.Td>
          <Table.Td>{closingAttorney.name}</Table.Td>
          <Table.Td>{closingHelpers.direct.witnessName}</Table.Td>
          <Table.Td>{closingHelpers.direct.witnessStudentName}</Table.Td>
          <Table.Td>{closingHelpers.direct.directOrder}</Table.Td>
          <Table.Td>{closingHelpers.cross.witnessName}</Table.Td>
          <Table.Td>{closingHelpers.cross.crossOrder}</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}
