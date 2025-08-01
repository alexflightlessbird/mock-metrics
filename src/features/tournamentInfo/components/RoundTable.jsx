import { Table } from "@mantine/core";
import DataTable from "../../../common/components/tables/DataTable";
import { formatSide } from "../../../common/utils/helpers";
import { useState } from "react";
import RoundManagementModal from "./RoundManagementModal";

export default function RoundTable({ caseType, data, role, refreshBallots }) {
    const roundColumns = [
        { value: "round_number", label: "Round" },
        { value: "side", label: "Side" },
        { value: "ballots", label: "Ballots" },
        { value: "result", label: "Result" },
        { value: "pd", label: "PD" }
    ];

    const [roundMgtModalOpened, setRoundMgtModalOpened] = useState(false);
    const [selectedRound, setSelectedRound] = useState(null);

    const handleSelectRound = (roundId) => {
        setSelectedRound(roundId);
        setRoundMgtModalOpened(true);
    }

    const renderRow = (r) => (
        <Table.Tr key={r.id} style={{ cursor: "pointer" }} onClick={() => handleSelectRound(r.id)}>
            <Table.Td>{r.round_number}</Table.Td>
            <Table.Td>{formatSide(r.side, caseType)}</Table.Td>
            <Table.Td>{r.ballots}</Table.Td>
            <Table.Td>{r.result}</Table.Td>
            <Table.Td
                style={{
                    color: r.pointDiff.startsWith("+") ? "green" : "red",
                    fontWeight: 500
                }}
            >
                {r.pointDiff}
            </Table.Td>

            <RoundManagementModal />
        </Table.Tr>
    );

    return (
        <>
            <DataTable
                columns={roundColumns}
                data={data}
                renderRow={renderRow}
                scrollContainer={false}
                fontSize="sm"
            />
            <RoundManagementModal 
                opened={roundMgtModalOpened} 
                selected={selectedRound} 
                onClose={() => {
                    setSelectedRound(null);
                    setRoundMgtModalOpened(false);
                }}
                caseType={caseType} 
                role={role}
                refreshBallots={refreshBallots}
            />
        </>
    )
}