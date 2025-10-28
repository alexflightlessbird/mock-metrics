import {
  Button,
  Stack,
  Text,
  Table,
  Space,
  Flex,
  Card,
  Group,
} from "@mantine/core";
import {
  useRoundDetails,
  useRoundBallots,
} from "../../../common/hooks/useRoundDetails";
import ShowIdText from "../../../common/components/ShowIdText";
import { LuTrash } from "react-icons/lu";
import DeleteConfirmationModal from "../../../common/components/modals-new/DeleteConfirmationModal";
import { ViewBallots } from "./BallotViews";
import BaseModal from "../../../common/components/modals-new/BaseModal";
import { formatSide } from "../../../common/utils/helpers";
import PageSection from "../../../common/components/PageSection";
import { useTheme } from "../../../context/ThemeContext";

export default function RoundManagementModal({
  selected,
  caseType,
  role,
  trigger,
  teamName,
  tournamentStatus = true,
}) {
  const round = selected;
  const { isDark } = useTheme();

  const {
    data: roundDetails,
    isLoading: roundLoading,
    deleteRound,
  } = useRoundDetails(round);
  const { data: roundBallots, isLoading: ballotsLoading } =
    useRoundBallots(round);

  if (roundLoading || ballotsLoading) return;

  return (
    <BaseModal
      modalId={`round-mgt-${round}`}
      title={
        roundLoading || ballotsLoading
          ? "Loading..."
          : `Round Management - Round ${roundDetails.round_number} (${teamName})`
      }
      trigger={trigger}
      footer={
        <Text c="dimmed" fz="xs">
          Last Updated:{" "}
          {new Date(roundDetails?.updated_at + "Z").toLocaleString()}
        </Text>
      }
    >
      <Group justify="space-between" align="flex-start">
        <Stack gap="0">
          <Text c="dimmed" fz="sm">
            Round #
          </Text>
          <Text fz="sm">{roundDetails?.round_number}</Text>
        </Stack>
        <Stack gap="0">
          <Text c="dimmed" fz="sm">
            Side
          </Text>
          <Text fz="sm">{formatSide(roundDetails?.side, caseType)}</Text>
        </Stack>
        <ShowIdText idName="Round" idValue={roundDetails?.id} fz="sm" />
      </Group>

      <Space h="md" />

      {(role === "primary" || role === "admin") && (
        <>
          <PageSection title="Danger Zone">
            <Flex gap="xl" align="center">
              <Text flex={1} c="red" fw={700} size="sm">
                THIS ACTION CANNOT BE REVERSED. PLEASE PROCEED WITH CAUTION.
              </Text>
              <DeleteConfirmationModal
                trigger={
                  <Button
                    w="fit-content"
                    leftSection={<LuTrash />}
                    color="red"
                    variant="outline"
                  >
                    Delete Round
                  </Button>
                }
                includeBallots={true}
                onSubmitFunction={() => {
                  deleteRound({
                    tournamentId: roundDetails?.tournament_id,
                    teamId: roundDetails?.team_id,
                    roundId: roundDetails?.id,
                  });
                }}
                entity={{
                  id: roundDetails?.id,
                }}
                entityName="round"
                layer={1}
              />
            </Flex>
          </PageSection>
          <Space h="md" />
        </>
      )}

      <PageSection title="Roles" collapsible={true}>
        <Card withBorder p="xs" bdrs="md">
          <Table
            highlightOnHover
            withRowBorders
            striped="even"
            stripedColor={isDark ? "dark.7" : undefined}
            fz="xs"
            style={{ cursor: "default" }}
            stickyHeader
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th width="25%">Role</Table.Th>
                <Table.Th width="37.5%">Attorney</Table.Th>
                <Table.Th width="37.5%">Witness</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>Opening</Table.Td>
                <Table.Td>
                  {roundDetails?.role_rounds?.find(
                    (r) => r.role_type === `${roundDetails.side}1`
                  )?.students?.name || "-"}
                </Table.Td>
                <Table.Td></Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td colSpan={3}></Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  P1
                  <br />
                  {roundDetails?.witness_rounds?.find(
                    (w) => w.role_type === "p1"
                  )?.witnesses?.name || "-"}
                </Table.Td>
                <Table.Td>
                  {roundDetails.side === "p"
                    ? roundDetails?.role_rounds?.find(
                        (s) => s.role_type === "p2"
                      )?.students?.name || "-"
                    : null}
                  {roundDetails.side === "d"
                    ? roundDetails?.role_rounds?.find(
                        (s) => s.role_type === "d2"
                      )?.students?.name || "-"
                    : null}
                </Table.Td>
                <Table.Td>
                  {roundDetails.side === "p"
                    ? roundDetails?.role_rounds?.find(
                        (s) => s.role_type === "p3"
                      )?.students?.name || "-"
                    : null}
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  P2
                  <br />
                  {roundDetails.witness_rounds?.find(
                    (w) => w.role_type === "p2"
                  )?.witnesses.name || "-"}
                </Table.Td>
                <Table.Td>
                  {roundDetails.side === "p"
                    ? roundDetails?.role_rounds?.find(
                        (s) => s.role_type === "p5"
                      )?.students?.name || "-"
                    : null}
                  {roundDetails.side === "d"
                    ? roundDetails?.role_rounds?.find(
                        (s) => s.role_type === "d3"
                      )?.students?.name || "-"
                    : null}
                </Table.Td>
                <Table.Td>
                  {roundDetails.side === "p"
                    ? roundDetails?.role_rounds?.find(
                        (s) => s.role_type === "p6"
                      )?.students?.name || "-"
                    : null}
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  P3
                  <br />
                  {roundDetails.witness_rounds?.find(
                    (w) => w.role_type === "p3"
                  )?.witnesses.name || "-"}
                </Table.Td>
                <Table.Td>
                  {roundDetails.side === "p"
                    ? roundDetails?.role_rounds?.find(
                        (s) => s.role_type === "p8"
                      )?.students?.name || "-"
                    : null}
                  {roundDetails.side === "d"
                    ? roundDetails?.role_rounds?.find(
                        (s) => s.role_type === "d4"
                      )?.students?.name || "-"
                    : null}
                </Table.Td>
                <Table.Td>
                  {roundDetails.side === "p"
                    ? roundDetails?.role_rounds?.find(
                        (s) => s.role_type === "p9"
                      )?.students?.name || "-"
                    : null}
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td colSpan={3}></Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  D1
                  <br />
                  {roundDetails.witness_rounds?.find(
                    (w) => w.role_type === "d1"
                  )?.witnesses.name || "-"}
                </Table.Td>
                <Table.Td>
                  {roundDetails.side === "p"
                    ? roundDetails?.role_rounds?.find(
                        (s) => s.role_type === "p11"
                      )?.students?.name || "-"
                    : null}
                  {roundDetails.side === "d"
                    ? roundDetails?.role_rounds?.find(
                        (s) => s.role_type === "d5"
                      )?.students?.name || "-"
                    : null}
                </Table.Td>
                <Table.Td>
                  {roundDetails.side === "d"
                    ? roundDetails?.role_rounds?.find(
                        (s) => s.role_type === "d6"
                      )?.students?.name || "-"
                    : null}
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  D2
                  <br />
                  {roundDetails.witness_rounds?.find(
                    (w) => w.role_type === "d2"
                  )?.witnesses.name || "-"}
                </Table.Td>
                <Table.Td>
                  {roundDetails.side === "p"
                    ? roundDetails?.role_rounds?.find(
                        (s) => s.role_type === "p12"
                      )?.students?.name || "-"
                    : null}
                  {roundDetails.side === "d"
                    ? roundDetails?.role_rounds?.find(
                        (s) => s.role_type === "d8"
                      )?.students?.name || "-"
                    : null}
                </Table.Td>
                <Table.Td>
                  {roundDetails.side === "d"
                    ? roundDetails?.role_rounds?.find(
                        (s) => s.role_type === "d9"
                      )?.students?.name || "-"
                    : null}
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  D3
                  <br />
                  {roundDetails.witness_rounds?.find(
                    (w) => w.role_type === "d3"
                  )?.witnesses.name || "-"}
                </Table.Td>
                <Table.Td>
                  {roundDetails.side === "p"
                    ? roundDetails?.role_rounds?.find(
                        (s) => s.role_type === "p13"
                      )?.students?.name || "-"
                    : null}
                  {roundDetails.side === "d"
                    ? roundDetails?.role_rounds?.find(
                        (s) => s.role_type === "d11"
                      )?.students?.name || "-"
                    : null}
                </Table.Td>
                <Table.Td>
                  {roundDetails.side === "d"
                    ? roundDetails?.role_rounds?.find(
                        (s) => s.role_type === "d12"
                      )?.students?.name || "-"
                    : null}
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td colSpan={3}></Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Closing</Table.Td>
                <Table.Td>
                  {roundDetails?.role_rounds?.find(
                    (r) => r.role_type === `${roundDetails.side}14`
                  )?.students?.name || "-"}
                </Table.Td>
                <Table.Td></Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Card>
      </PageSection>

      <Space h="md" />

      <PageSection title="Ballots" collapsible={true}>
        <ViewBallots
          ballots={roundBallots}
          side={roundDetails.side}
          role={role}
          tournamentStatus={tournamentStatus}
          roundId={round}
          caseType={caseType}
          teamName={teamName}
        />
      </PageSection>
    </BaseModal>
  );
}
