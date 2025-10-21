import { Table, Card } from "@mantine/core";
import DataTable from "../../../common/components/tables/DataTable";
import { formatSide } from "../../../common/utils/helpers";
import RoundManagementModal from "./RoundManagementModal";

export default function RoundTable({
  caseType,
  data,
  role,
  refreshBallots,
  tournamentStatus,
  teamName,
}) {
  const roundColumns = [
    { value: "round_number", label: "Round" },
    { value: "side", label: "Side" },
    { value: "ballots", label: "Ballots" },
    { value: "result", label: "Result" },
    { value: "pd", label: "PD" },
  ];

  const renderRow = (r) => (
    <RoundManagementModal
      key={r.id}
      selected={r.id}
      teamName={teamName}
      caseType={caseType}
      role={role}
      refreshBallots={refreshBallots}
      tournamentStatus={tournamentStatus}
      trigger={
        <Table.Tr style={{ cursor: "pointer" }} tabIndex={0}>
          <Table.Td>{r.round_number}</Table.Td>
          <Table.Td>{formatSide(r.side, caseType)}</Table.Td>
          <Table.Td>{r.ballots}</Table.Td>
          <Table.Td>{r.result}</Table.Td>
          <Table.Td
            style={{
              color: r.pointDiff.startsWith("+") ? "green" : "red",
              fontWeight: 500,
            }}
          >
            {r.pointDiff}
          </Table.Td>
        </Table.Tr>
      }
    ></RoundManagementModal>
  );

  return (
    <Card withBorder p="xs" bdrs="md">
      <Table.ScrollContainer minWidth={150}>
        <DataTable
          columns={roundColumns}
          data={data}
          renderRow={renderRow}
          scrollContainer={false}
          fontSize="sm"
          emptyMessage="No rounds recorded yet"
          withTableBorder={false}
        />
      </Table.ScrollContainer>
    </Card>
  );
}
