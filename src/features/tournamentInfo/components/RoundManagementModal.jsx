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
  Divider,
  useModalsStack,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import {
  useRoundDetails,
  useRoundBallots,
} from "../../../common/hooks/useRoundDetails";
import Loader from "../../../common/components/loader/GavelLoader";
import ShowIdText from "../../../common/components/ShowIdText";
import { LuTrash } from "react-icons/lu";
import OldDeleteConfirmationModal from "../../../common/components/modals/DeleteConfirmationModal";
import DeleteConfirmationModal from "../../../common/components/modals-new/DeleteConfirmationModal";
import { ViewBallots } from "./BallotViews";
import BaseModal from "../../../common/components/modals-new/BaseModal";

export default function RoundManagementModal({
  selected,
  caseType,
  role,
  trigger,
  refreshBallots,
  tournamentStatus = true,
}) {
  const round = selected;
  const stack = useModalsStack(["delete", "management", "edit"]);

  const [viewType, setViewType] = useState(null);
  const [detailViewType, setDetailViewType] = useState(null);
  const [deleteRoundModalOpened, setDeleteRoundModalOpened] = useState(false);

  const [ballotsView, setBallotsView] = useState("view");

  const {
    data: roundDetails,
    isLoading: roundLoading,
    deleteRound,
  } = useRoundDetails(round);
  const { data: roundBallots, isLoading: ballotsLoading } =
    useRoundBallots(round);

  return (
    <BaseModal
      modalId={`round-mgt-${round}`}
      onClose={() => {
        setViewType(null);
        setDetailViewType(null);
        setBallotsView("view");
      }}
      title={
        roundLoading || ballotsLoading
          ? "Loading..."
          : `Round Management - Round ${
              roundDetails.round_number
            } (${roundDetails.side.toUpperCase()})`
      }
      trigger={trigger}
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
        <Radio.Group value={detailViewType} onChange={setDetailViewType}>
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
          <ShowIdText idName="Round" idValue={roundDetails.id} />

          {(role === "primary" || role === "admin") && (
            <DeleteConfirmationModal
              entityName="round"
              layer={1}
              entity={{
                id: roundDetails.id,
              }}
              onSubmitFunction={() => {
                deleteRound({
                  tournamentId: roundDetails.tournament_id,
                  teamId: roundDetails.team_id,
                  roundId: roundDetails.id,
                });
              }}
              trigger={
                <Button
                  color="red"
                  variant="outline"
                  leftSection={<LuTrash />}
                  mt="sm"
                  onClick={() => setDeleteRoundModalOpened(true)}
                >
                  Delete Round
                </Button>
              }
            />
          )}
        </>
      )}

      {viewType === "detail" && detailViewType === "wits" && (
        <Table
          striped
          highlightOnHover
          fz="xs"
          withTableBorder
          style={{ cursor: "default" }}
        >
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
              <Table.Td>
                {roundDetails.witness_rounds?.find((w) => w.role_type === "p1")
                  ?.witnesses.name || "-"}
              </Table.Td>
              <Table.Td>
                {roundDetails.witness_rounds?.find((w) => w.role_type === "d1")
                  ?.witnesses.name || "-"}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>2</Table.Td>
              <Table.Td>
                {roundDetails.witness_rounds?.find((w) => w.role_type === "p2")
                  ?.witnesses.name || "-"}
              </Table.Td>
              <Table.Td>
                {roundDetails.witness_rounds?.find((w) => w.role_type === "d2")
                  ?.witnesses.name || "-"}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>3</Table.Td>
              <Table.Td>
                {roundDetails.witness_rounds?.find((w) => w.role_type === "p3")
                  ?.witnesses.name || "-"}
              </Table.Td>
              <Table.Td>
                {roundDetails.witness_rounds?.find((w) => w.role_type === "d3")
                  ?.witnesses.name || "-"}
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      )}

      {viewType === "detail" && detailViewType === "roles" && (
        <Table
          striped
          highlightOnHover
          withTableBorder
          fz="xs"
          style={{ cursor: "default" }}
        >
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
                {roundDetails.role_rounds?.find(
                  (r) => r.role_type === `${roundDetails.side}1`
                )?.students.name || "-"}
              </Table.Td>
              <Table.Td align="center">-</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td colSpan={3} align="center">
                -
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>
                P1
                <br />
                {roundDetails.witness_rounds?.find((w) => w.role_type === "p1")
                  ?.witnesses.name || "-"}
              </Table.Td>
              <Table.Td>
                {roundDetails.side === "p"
                  ? roundDetails.role_rounds?.find((s) => s.role_type === "p2")
                      ?.students.name || "-"
                  : null}
                {roundDetails.side === "d"
                  ? roundDetails.role_rounds?.find((s) => s.role_type === "d2")
                      ?.students.name || "-"
                  : null}
              </Table.Td>
              <Table.Td
                align={roundDetails.side === "d" ? "center" : undefined}
              >
                {roundDetails.side === "p"
                  ? roundDetails.role_rounds?.find((s) => s.role_type === "p3")
                      ?.students.name || "-"
                  : null}
                {roundDetails.side === "d" ? "-" : null}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>
                P2
                <br />
                {roundDetails.witness_rounds?.find((w) => w.role_type === "p2")
                  ?.witnesses.name || "-"}
              </Table.Td>
              <Table.Td>
                {roundDetails.side === "p"
                  ? roundDetails.role_rounds?.find((s) => s.role_type === "p5")
                      ?.students.name || "-"
                  : null}
                {roundDetails.side === "d"
                  ? roundDetails.role_rounds?.find((s) => s.role_type === "d3")
                      ?.students.name || "-"
                  : null}
              </Table.Td>
              <Table.Td
                align={roundDetails.side === "d" ? "center" : undefined}
              >
                {roundDetails.side === "p"
                  ? roundDetails.role_rounds?.find((s) => s.role_type === "p6")
                      ?.students.name || "-"
                  : null}
                {roundDetails.side === "d" ? "-" : null}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>
                P3
                <br />
                {roundDetails.witness_rounds?.find((w) => w.role_type === "p3")
                  ?.witnesses.name || "-"}
              </Table.Td>
              <Table.Td>
                {roundDetails.side === "p"
                  ? roundDetails.role_rounds?.find((s) => s.role_type === "p8")
                      ?.students.name || "-"
                  : null}
                {roundDetails.side === "d"
                  ? roundDetails.role_rounds?.find((s) => s.role_type === "d4")
                      ?.students.name || "-"
                  : null}
              </Table.Td>
              <Table.Td
                align={roundDetails.side === "d" ? "center" : undefined}
              >
                {roundDetails.side === "p"
                  ? roundDetails.role_rounds?.find((s) => s.role_type === "p9")
                      ?.students.name || "-"
                  : null}
                {roundDetails.side === "d" ? "-" : null}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td colSpan={3} align="center">
                -
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>
                D1
                <br />
                {roundDetails.witness_rounds?.find((w) => w.role_type === "d1")
                  ?.witnesses.name || "-"}
              </Table.Td>
              <Table.Td>
                {roundDetails.side === "p"
                  ? roundDetails.role_rounds?.find((s) => s.role_type === "p11")
                      ?.students.name || "-"
                  : null}
                {roundDetails.side === "d"
                  ? roundDetails.role_rounds?.find((s) => s.role_type === "d5")
                      ?.students.name || "-"
                  : null}
              </Table.Td>
              <Table.Td
                align={roundDetails.side === "p" ? "center" : undefined}
              >
                {roundDetails.side === "p" ? "-" : null}
                {roundDetails.side === "d"
                  ? roundDetails.role_rounds?.find((s) => s.role_type === "d6")
                      ?.students.name || "-"
                  : null}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>
                D2
                <br />
                {roundDetails.witness_rounds?.find((w) => w.role_type === "d2")
                  ?.witnesses.name || "-"}
              </Table.Td>
              <Table.Td>
                {roundDetails.side === "p"
                  ? roundDetails.role_rounds?.find((s) => s.role_type === "p12")
                      ?.students.name || "-"
                  : null}
                {roundDetails.side === "d"
                  ? roundDetails.role_rounds?.find((s) => s.role_type === "d8")
                      ?.students.name || "-"
                  : null}
              </Table.Td>
              <Table.Td
                align={roundDetails.side === "p" ? "center" : undefined}
              >
                {roundDetails.side === "p" ? "-" : null}
                {roundDetails.side === "d"
                  ? roundDetails.role_rounds?.find((s) => s.role_type === "d9")
                      ?.students.name || "-"
                  : null}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>
                D3
                <br />
                {roundDetails.witness_rounds?.find((w) => w.role_type === "d3")
                  ?.witnesses.name || "-"}
              </Table.Td>
              <Table.Td>
                {roundDetails.side === "p"
                  ? roundDetails.role_rounds?.find((s) => s.role_type === "p13")
                      ?.students.name || "-"
                  : null}
                {roundDetails.side === "d"
                  ? roundDetails.role_rounds?.find((s) => s.role_type === "d11")
                      ?.students.name || "-"
                  : null}
              </Table.Td>
              <Table.Td
                align={roundDetails.side === "p" ? "center" : undefined}
              >
                {roundDetails.side === "p" ? "-" : null}
                {roundDetails.side === "d"
                  ? roundDetails.role_rounds?.find((s) => s.role_type === "d12")
                      ?.students.name || "-"
                  : null}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td colSpan={3} align="center">
                -
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Closing</Table.Td>
              <Table.Td>
                {roundDetails.role_rounds?.find(
                  (r) => r.role_type === `${roundDetails.side}14`
                )?.students.name || "-"}
              </Table.Td>
              <Table.Td align="center">-</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      )}

      {viewType === "ballots" && (
        <Radio.Group value={ballotsView} onChange={setBallotsView}>
          <Group>
            <Radio value="view" label="View Current Ballots" />
            {tournamentStatus && <Radio value="add" label="Add New Ballot" />}
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
            side={roundDetails.side}
            role={role}
            tournamentStatus={tournamentStatus}
            modalStack={stack}
          />
        </>
      )}
    </BaseModal>
  );
}
