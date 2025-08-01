import { Table, Button, Text, Stack, List, Modal } from "@mantine/core";
import { useState } from "react";
import { EditDeleteTableActions, ConfirmCancelTableActions } from "../../../common/components/tables/TableActions";
import DataTable from "../../../common/components/tables/DataTable";
import DeleteConfirmationModal from "../../../common/components/modals/DeleteConfirmationModal";

export function ViewBallots({
    ballots,
    onUpdate,
    onRemove,
    editBallotId,
    setEditBallotId,
    role,
    refreshBallots
}) {
    const [editValues, setEditValues] = useState({});
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteBallotId, setDeleteBallotId] = useState(null);

    if (!ballots?.length) return <Text>No ballots assigned to this round</Text>

    console.log(ballots);

    const handleEditStart = (ballot) => {
        setEditBallotId(ballot.id);
        setEditModalOpen(true);
    };

    const handleEditCancel = () => {
        setEditModalOpen(false);
        setEditBallotId(null);
    }

    const handleEditSubmit = (id) => {
        //update ballot
        setEditModalOpen(false);
        setEditBallotId(null);
    }

    const handleDeleteStart = (ballot) => {
        setDeleteBallotId(ballot.id);
        setDeleteModalOpen(true);
    }

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
        setDeleteBallotId(null);
    }

    const handleDeleteSubmit = (id) => {
        //delete ballot
        setDeleteModalOpen(false);
        setEditBallotId(null);
    }

    const pTotal = (ballot) => {
        const scores = ballot.scores.filter(s => s.score_type.startsWith("p")).map(s => s.score_value);
        const total = scores.reduce((total, current) => total + current, 0);
        return total;
    }

    const dTotal = (ballot) => {
        const scores = ballot.scores.filter(s => s.score_type.startsWith("d")).map(s => s.score_value);
        const total = scores.reduce((total, current) => total + current, 0);
        return total;
    }

    return (
        <Button onClick={() => pTotal(ballots[0])}>
            Log
        </Button>
    )
}