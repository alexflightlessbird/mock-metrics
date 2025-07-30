import { Table } from "@mantine/core";
import DataTable from "../../../common/components/tables/DataTable";
import { formatSide } from "../../../common/utils/helpers";

export default function RoundTable({ caseType, data }) {
    const roundColumns = [
        { value: "round_number", label: "Round" },
        { value: "side", label: "Side" },
        { value: "ballots", label: "Ballots" },
        { value: "result", label: "Result" },
        { value: "pd", label: "PD" }
    ];

    const renderRow = (r) => (
        <Table.Tr key={r.round_number}>
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
        </Table.Tr>
    );

    return (
        <DataTable
            columns={roundColumns}
            data={data}
            renderRow={renderRow}
            scrollContainer={false}
            fontSize="sm"
        />
    )
}