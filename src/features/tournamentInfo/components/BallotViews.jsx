import { Table, Button, Text, Stack, List, Modal } from "@mantine/core";
import { useState } from "react";
import {
	EditDeleteTableActions,
	ConfirmCancelTableActions,
} from "../../../common/components/tables/TableActions";
import DataTable from "../../../common/components/tables/DataTable";
import DeleteConfirmationModal from "../../../common/components/modals/DeleteConfirmationModal";
import EditBallotModal from "./EditBallotModal";

export function ViewBallots({
	ballots,
	onUpdate,
	onRemove,
	role,
	refreshBallots,
	side,
	tournamentStatus,
	modalStack,
}) {
	const [editValues, setEditValues] = useState({});
	const [editBallotId, setEditBallotId] = useState(null);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [deleteBallotId, setDeleteBallotId] = useState(null);

	if (!ballots?.length) return <Text>No ballots assigned to this round</Text>;

	const handleSelectBallot = (ballotId) => {
		setEditBallotId(ballotId);
		setEditModalOpen(true);
	};

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
					? pTotal(ballots[0]) - dTotal(ballots[0]) < 0
						? `Loss: ${pTotal(ballots[0]) - dTotal(ballots[0])}`
						: pTotal(ballots[0]) - dTotal(ballots[0]) == 0
						? "Tie"
						: `Win: +${pTotal(ballots[0]) - dTotal(ballots[0])}`
					: side === "d"
					? dTotal(ballots[0]) - pTotal(ballots[0]) < 0
						? `Loss: ${dTotal(ballots[0]) - pTotal(ballots[0])}`
						: dTotal(ballots[0]) - pTotal(ballots[0]) == 0
						? "Tie"
						: `Win: +${dTotal(ballots[0]) - pTotal(ballots[0])}`
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
			<DataTable
				columns={tableColumns}
				data={ballots}
				renderRow={renderRow}
				emptyMessage="No ballots assigned to this round"
				scrollContainer={true}
				scrollContainerHeight="30vh"
				removeId={true}
			/>
			<Button onClick={() => console.log(ballots)}>Log</Button>
			{editModalOpen && (
				<EditBallotModal
					stack={modalStack}
					opened={editModalOpen}
					onClose={() => {
						setEditModalOpen(false);
						setEditBallotId(null);
					}}
					selected={editBallotId}
					role={role}
					tournamentStatus={tournamentStatus}
				/>
			)}
		</>
	);
}
