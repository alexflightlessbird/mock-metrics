import { Card, Table, Text } from "@mantine/core";
import DataTable from "../../../common/components/tables/DataTable";
import AddButton from "../../../common/components/AddButton";
import AddBallotModal from "./AddBallotModal";
import BallotManagementModal from "./BallotManagementModal";

export function ViewBallots({
  ballots,
  role,
  side,
  tournamentStatus,
  roundId,
  caseType,
  teamName
}) {
  const pTotal = (ballot) => {
    const scores = ballot.scores
      .filter((s) => s.score_type.startsWith("p"))
      .map((s) => s.score_value);
    const total = scores.reduce((total, current) => total + current, 0);
    return total;
  };

  const dTotal = (ballot) => {
    const scores = ballot.scores
      .filter((s) => s.score_type.startsWith("d"))
      .map((s) => s.score_value);
    const total = scores.reduce((total, current) => total + current, 0);
    return total;
  };

  const renderRow = (b) => (
    <BallotManagementModal
      key={b.id}
      selected={b.id}
      roundId={roundId}
      caseType={caseType}
      role={role}
      tournamentStatus={tournamentStatus}
      teamName={teamName}
      trigger={
        <Table.Tr style={{ cursor: "pointer" }} tabIndex={0}>
          <Table.Td>{b.judge_name || "-"}</Table.Td>
          <Table.Td>
            {side === "p" 
              ? pTotal(b) - dTotal(b) < 0
                ? `Loss: ${pTotal(b) - dTotal(b)}`
                : pTotal(b) - dTotal(b) == 0
                ? "Tie"
                : `Win: +${pTotal(b) - dTotal(b)}`
              : side === "d"
              ? dTotal(b) - pTotal(b) < 0
                ? `Loss: ${dTotal(b) - pTotal(b)}`
                : dTotal(b) - pTotal(b) == 0
                ? "Tie"
                :  `Win: +${dTotal(b) - pTotal(b)}`
              : "-"
            }
          </Table.Td>
        </Table.Tr>
      }
    ></BallotManagementModal>
  )

  const tableColumns = [
    { value: "id", label: "ID" },
    { value: "judge_name", label: "Judge Name" },
    { value: "result", label: "Result" },
  ];

  console.log(ballots.length);

  return (
    <>
      {tournamentStatus && (role === "primary" || role === "admin") && (
        <AddBallotModal
          role={role}
          trigger={<AddButton>Add Ballot</AddButton>}
          roundId={roundId}
          caseType={caseType}
        />
      )}
      {ballots.length == 0 && (
        <Text c="dimmed">No ballots assigned to this round</Text>
      )}
      {ballots.length > 0 && (
        <Card withBorder p="xs" bdrs="md">
          <DataTable
            columns={tableColumns}
            data={ballots}
            renderRow={renderRow}
            emptyMessage="No ballots assigned to this round"
            scrollContainer={true}
            scrollContainerHeight="30vh"
            removeId={true}
            withTableBorder={false}
          />
        </Card>
      )}
    </>
  );
}
