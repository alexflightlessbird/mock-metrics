import {
  Text,
  Table,
  Space,
  Card,
} from "@mantine/core";
import {
  useRoundDetails,
  useRoundBallots,
} from "../../../common/hooks/useRoundDetails";
import { ViewBallots } from "./BallotViews";
import BaseModal from "../../../common/components/modals-new/BaseModal";
import { formatSide } from "../../../common/utils/helpers";
import PageSection from "../../../common/components/PageSection";
import { useTheme } from "../../../context/ThemeContext";
import PageDetailSection from "../../../common/components/PageDetailSection";
import DangerZoneSection from "../../../common/components/DangerZoneSection";

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
      <PageDetailSection
        details={[
          { name: "Round #", value: roundDetails?.round_number },
          { name: "Side", value: formatSide(roundDetails?.side, caseType) },
          { type: "id", name: "Round", value: roundDetails?.id }
        ]}
      />

      <Space h="md" />

      {(role === "primary" || role === "admin") && (
        <DangerZoneSection
          buttonLabel="Round"
          includeBallots={true}
          onSubmit={() => {
            deleteRound({
              tournamentId: roundDetails?.tournament_id,
              teamId: roundDetails?.team_id,
              roundId: roundDetails?.id,
            });
          }}
          entity={{ id: roundDetails?.id }}
          entityName="round"
          layer={1}
        />
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
