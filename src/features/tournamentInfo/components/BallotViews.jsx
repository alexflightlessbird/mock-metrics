import { Table, Button, Text, Stack, List, Modal } from "@mantine/core";
import { useState } from "react";
import DataTable from "../../../common/components/tables/DataTable";
import DeleteConfirmationModal from "../../../common/components/modals/DeleteConfirmationModal";
import AddButton from "../../../common/components/AddButton";
import AddBallotModal from "./AddBallotModal";

export function ViewBallots({
  ballots,
  role,
  side,
  tournamentStatus,
  roundId,
  caseType,
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

  const renderRow = (ballot) => (
    <Table.Tr
      key={ballot.id}
      style={{ cursor: "pointer" }}
      onClick={() => handleSelectBallot(ballot.id)}
    >
      <Table.Td>{ballot.judge_name || "-"}</Table.Td>
      <Table.Td>
        {side === "p"
          ? pTotal(ballot) - dTotal(ballot) < 0
            ? `Loss: ${pTotal(ballot) - dTotal(ballot)}`
            : pTotal(ballot) - dTotal(ballot) == 0
            ? "Tie"
            : `Win: +${pTotal(ballot) - dTotal(ballot)}`
          : side === "d"
          ? dTotal(ballot) - pTotal(ballot) < 0
            ? `Loss: ${dTotal(ballot) - pTotal(ballot)}`
            : dTotal(ballot) - pTotal(ballot) == 0
            ? "Tie"
            : `Win: +${dTotal(ballot) - pTotal(ballot)}`
          : "-"}
      </Table.Td>
    </Table.Tr>
  );

  const tableColumns = [
    { value: "id", label: "ID" },
    { value: "judge_name", label: "Judge Name" },
    { value: "result", label: "Result" },
  ];

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
      <DataTable
        columns={tableColumns}
        data={ballots}
        renderRow={renderRow}
        emptyMessage="No ballots assigned to this round"
        scrollContainer={true}
        scrollContainerHeight="30vh"
        removeId={true}
      />
    </>
  );
}
