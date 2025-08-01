import {
    Modal,
    Radio,
    Button,
    Group,
    Stack,
    Text,
    Box,
    Select,
    MultiSelect,
    Table,
    Space,
    Divider
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useRoundDetails, useRoundBallots } from "../../../common/hooks/useRoundDetails";
import Loader from "../../../common/components/loader/GavelLoader";
import ShowIdText from "../../../common/components/ShowIdText";
import { LuTrash } from "react-icons/lu";
import DeleteConfirmationModal from "../../../common/components/modals/DeleteConfirmationModal";
import { ViewBallots } from "./BallotViews";

export default function RoundManagementModal({
    opened,
    onClose,
    selected,
    caseType,
    role,
    refreshBallots
}) {
    const round = selected;

    const [viewType, setViewType] = useState(null);
    const [detailViewType, setDetailViewType] = useState(null);
    const [deleteRoundModalOpened, setDeleteRoundModalOpened] = useState(false);

    const [ballotsView, setBallotsView] = useState("view");

    const [editBallotdId, setEditBallotId] = useState(null);

    const [formLoading, setFormLoading] = useState(false);
    const [formValues, setFormValues] = useState({});

    const { data: roundDetails, isLoading: roundLoading, deleteRound } = useRoundDetails(round);
    const { data: roundBallots, isLoading: ballotsLoading, deleteBallot } = useRoundBallots(round);

    if (roundLoading || ballotsLoading) return (
        <Modal centered opened={opened} onClose={onClose} title="Loading...">
            <Loader />
        </Modal>
    )

    return (
        <Modal 
            centered 
            opened={opened} 
            onClose={() => {
                setViewType(null);
                setDetailViewType(null);
                setBallotsView("view");
                setFormLoading(false);
                onClose();
            }} 
            title="Round Management" 
            size="xl" 
            styles={{ content: { maxHeight: "80%", overflowY: "auto" }, body: { overflowY: "auto" } }}
        >
            <Radio.Group
                name="viewOption"
                label="Choose what you want to view"
                value={viewType}
                onChange={setViewType}
            >
                <Group>
                    <Radio value="detail" label="Round Details" data-autofocus />
                    <Radio value="ballots" label="Round Ballots" />
                </Group>
            </Radio.Group>

            {viewType !== null && (
                <>
                    <Space h="md" />
                    <Divider />
                    <Space h="sm" />
                </>
            )}

            {viewType === "detail" && (
                <Radio.Group
                    value={detailViewType}
                    onChange={setDetailViewType}
                >
                    <Group>
                        <Radio value="info" label="Information" />
                        <Radio value="wits" label="Witnesses" />
                        <Radio value="roles" label="Roles" />
                    </Group>
                </Radio.Group>
            )}

            {viewType === "detail" && detailViewType !== null && (
                <>
                    <Space h="md" />
                    <Divider />
                    <Space h="sm" />
                </>
            )}

            {viewType === "detail" && detailViewType === "info" && (
                <>
                    <Text>Round Number: {roundDetails.round_number}</Text>
                    <Text>Side: {roundDetails.side === "d" ? "Defense" : roundDetails.side === "p" ? caseType === "civil" ? "Plaintiff" : caseType === "criminal" ? "Prosecution" : "Plaintiff/Prosecution" : "-"}</Text>
                    <ShowIdText idName="Round" idValue={roundDetails.id} />

                    {(role === "primary" || role === "admin") && (
                        <>
                            <Button
                                color="red"
                                variant="outline"
                                leftSection={<LuTrash />}
                                mt="sm"
                                onClick={() => setDeleteRoundModalOpened(true)}
                            >
                                Delete Round
                            </Button>
                            <DeleteConfirmationModal
                                entityName="round"
                                onClose={() => setDeleteRoundModalOpened(false)}
                                opened={deleteRoundModalOpened}
                                onSubmitFunction={() => {
                                    deleteRound({ tournamentId: roundDetails.tournament_id, teamId: roundDetails.team_id, roundId: roundDetails.id });
                                    onClose();
                                }}
                            />
                        </>
                    )}
                </>
            )}

            {viewType === "detail" && detailViewType === "wits" && (
                <Table striped highlightOnHover fz="xs" withTableBorder>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Td></Table.Td>
                            <Table.Td>P</Table.Td>
                            <Table.Td>D</Table.Td>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td>1</Table.Td>
                            <Table.Td>{roundDetails.witness_rounds?.find(w => w.role_type === "p1")?.witnesses.name || "-"}</Table.Td>
                            <Table.Td>{roundDetails.witness_rounds?.find(w => w.role_type === "d1")?.witnesses.name || "-"}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td>2</Table.Td>
                            <Table.Td>{roundDetails.witness_rounds?.find(w => w.role_type === "p2")?.witnesses.name || "-"}</Table.Td>
                            <Table.Td>{roundDetails.witness_rounds?.find(w => w.role_type === "d2")?.witnesses.name || "-"}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td>3</Table.Td>
                            <Table.Td>{roundDetails.witness_rounds?.find(w => w.role_type === "p3")?.witnesses.name || "-"}</Table.Td>
                            <Table.Td>{roundDetails.witness_rounds?.find(w => w.role_type === "d3")?.witnesses.name || "-"}</Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            )}

            {viewType === "detail" && detailViewType === "roles" && (
                <Table striped highlightOnHover withTableBorder fz="xs">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Td>Role</Table.Td>
                            <Table.Td>Attorney</Table.Td>
                            <Table.Td>Witness</Table.Td>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td>Opening</Table.Td>
                            <Table.Td>
                                {roundDetails.role_rounds?.find(r => r.role_type === `${roundDetails.side}1`)?.students.name || "-"}
                            </Table.Td>
                            <Table.Td align="center">-</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td colSpan={3} align="center">-</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td>
                                P1
                                <br />
                                {roundDetails.witness_rounds?.find(w => w.role_type === "p1")?.witnesses.name || "-"}
                            </Table.Td>
                            <Table.Td>
                                {roundDetails.side === "p" ? roundDetails.role_rounds?.find(s => s.role_type === "p2")?.students.name || "-" : null}
                                {roundDetails.side === "d" ? roundDetails.role_rounds?.find(s => s.role_type === "d2")?.students.name || "-" : null}
                            </Table.Td>
                            <Table.Td align={roundDetails.side === "d" ? "center" : undefined}>
                                {roundDetails.side === "p" ? roundDetails.role_rounds?.find(s => s.role_type === "p3")?.students.name || "-" : null}
                                {roundDetails.side === "d" ? "-" : null}
                            </Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td>
                                P2
                                <br />
                                {roundDetails.witness_rounds?.find(w => w.role_type === "p2")?.witnesses.name || "-"}
                            </Table.Td>
                            <Table.Td>
                                {roundDetails.side === "p" ? roundDetails.role_rounds?.find(s => s.role_type === "p5")?.students.name || "-" : null}
                                {roundDetails.side === "d" ? roundDetails.role_rounds?.find(s => s.role_type === "d3")?.students.name || "-" : null}
                            </Table.Td>
                            <Table.Td align={roundDetails.side === "d" ? "center" : undefined}>
                                {roundDetails.side === "p" ? roundDetails.role_rounds?.find(s => s.role_type === "p6")?.students.name || "-" : null}
                                {roundDetails.side === "d" ? "-" : null}
                            </Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td>
                                P3
                                <br />
                                {roundDetails.witness_rounds?.find(w => w.role_type === "p3")?.witnesses.name || "-"}
                            </Table.Td>
                            <Table.Td>
                                {roundDetails.side === "p" ? roundDetails.role_rounds?.find(s => s.role_type === "p8")?.students.name || "-" : null}
                                {roundDetails.side === "d" ? roundDetails.role_rounds?.find(s => s.role_type === "d4")?.students.name || "-" : null}
                            </Table.Td>
                            <Table.Td align={roundDetails.side === "d" ? "center" : undefined}>
                                {roundDetails.side === "p" ? roundDetails.role_rounds?.find(s => s.role_type === "p9")?.students.name || "-" : null}
                                {roundDetails.side === "d" ? "-" : null}
                            </Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td colSpan={3} align="center">-</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td>
                                D1
                                <br />
                                {roundDetails.witness_rounds?.find(w => w.role_type === "d1")?.witnesses.name || "-"}
                            </Table.Td>
                            <Table.Td>
                                {roundDetails.side === "p" ? roundDetails.role_rounds?.find(s => s.role_type === "p11")?.students.name || "-" : null}
                                {roundDetails.side === "d" ? roundDetails.role_rounds?.find(s => s.role_type === "d5")?.students.name || "-" : null}
                            </Table.Td>
                            <Table.Td align={roundDetails.side === "p" ? "center" : undefined}>
                                {roundDetails.side === "p" ? "-" : null}
                                {roundDetails.side === "d" ? roundDetails.role_rounds?.find(s => s.role_type === "d6")?.students.name || "-" : null}
                            </Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td>
                                D2
                                <br />
                                {roundDetails.witness_rounds?.find(w => w.role_type === "d2")?.witnesses.name || "-"}
                            </Table.Td>
                            <Table.Td>
                                {roundDetails.side === "p" ? roundDetails.role_rounds?.find(s => s.role_type === "p12")?.students.name || "-" : null}
                                {roundDetails.side === "d" ? roundDetails.role_rounds?.find(s => s.role_type === "d8")?.students.name || "-" : null}
                            </Table.Td>
                            <Table.Td align={roundDetails.side === "p" ? "center" : undefined}>
                                {roundDetails.side === "p" ? "-" : null}
                                {roundDetails.side === "d" ? roundDetails.role_rounds?.find(s => s.role_type === "d9")?.students.name || "-" : null}
                            </Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td>
                                D3
                                <br />
                                {roundDetails.witness_rounds?.find(w => w.role_type === "d3")?.witnesses.name || "-"}
                            </Table.Td>
                            <Table.Td>
                                {roundDetails.side === "p" ? roundDetails.role_rounds?.find(s => s.role_type === "p13")?.students.name || "-" : null}
                                {roundDetails.side === "d" ? roundDetails.role_rounds?.find(s => s.role_type === "d11")?.students.name || "-" : null}
                            </Table.Td>
                            <Table.Td align={roundDetails.side === "p" ? "center" : undefined}>
                                {roundDetails.side === "p" ? "-" : null}
                                {roundDetails.side === "d" ? roundDetails.role_rounds?.find(s => s.role_type === "d12")?.students.name || "-" : null}
                            </Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td colSpan={3} align="center">-</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td>Closing</Table.Td>
                            <Table.Td>
                                {roundDetails.role_rounds?.find(r => r.role_type === `${roundDetails.side}14`)?.students.name || "-"}
                            </Table.Td>
                            <Table.Td align="center">-</Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            )}

            {viewType === "ballots" && (
                <Radio.Group
                    value={ballotsView}
                    onChange={setBallotsView}
                >
                    <Group>
                        <Radio value="view" label="View Current Ballots" />
                        <Radio value="add" label="Add New Ballot" />
                    </Group>
                </Radio.Group>
            )}

            {viewType === "ballots" && ballotsView !== null && (
                <>
                    <Space h="md" />
                    <Divider />
                    <Space h="sm" />
                </>
            )}

            {viewType === "ballots" && ballotsView === "view" && (
                <>
                    <ViewBallots 
                        ballots={roundBallots}
                        refreshBallots={refreshBallots}
                    />
                </>
            )}
        </Modal>
    )
}