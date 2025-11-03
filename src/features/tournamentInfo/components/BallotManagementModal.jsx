import {
  Button,
  Stack,
  Text,
  Table,
  Space,
  Flex,
  Card,
  Group,
  ScrollArea,
} from "@mantine/core";
import { useBallotDetails } from "../../../common/hooks/useBallotDetails";
import ShowIdText from "../../../common/components/ShowIdText";
import { LuTrash } from "react-icons/lu";
import DeleteConfirmationModal from "../../../common/components/modals-new/DeleteConfirmationModal";
import BaseModal from "../../../common/components/modals-new/BaseModal";
import PageSection from "../../../common/components/PageSection";
import { formatSide } from "../../../common/utils/helpers";
import { useRoundDetails } from "../../../common/hooks/useRoundDetails";

export default function BallotManagementModal({
  selected,
  roundId,
  caseType,
  role,
  trigger,
  teamName,
}) {
  const ballot = selected;

  const {
    data: ballotDetails,
    isLoading: ballotLoading,
    deleteBallot,
  } = useBallotDetails(ballot);
  const { data: roundDetails, isLoading: roundLoading } =
    useRoundDetails(roundId);

  if (ballotLoading || roundLoading) return;

  const scoreDisplay = (scoreType) => {
    return (
      ballotDetails?.scores?.find((s) => s.score_type === scoreType)
        ?.score_value || "-"
    );
  };

  return (
    <BaseModal
      modalId={`ballot-mgt-${ballot}`}
      title={
        ballotLoading || roundLoading
          ? "Loading..."
          : `Ballot Management (${teamName})`
      }
      trigger={trigger}
      layer={1}
      footer={
        <Text c="dimmed" fz="xs">
          Last Updated:{" "}
          {new Date(ballotDetails?.updated_at + "Z").toLocaleString()}
        </Text>
      }
    >
      <Group justify="space-between" align="flex-start">
        <Stack gap="0">
          <Text c="dimmed" fz="sm">
            Judge
          </Text>
          <Text fz="sm">{ballotDetails?.judge_name}</Text>
        </Stack>
        <ShowIdText idName="Ballot" idValue={ballotDetails?.id} fz="sm" />
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
                    Delete Ballot
                  </Button>
                }
                includeBallots={false}
                onSubmitFunction={() => {
                  deleteBallot({
                    ballotId: ballotDetails?.id,
                    roundId,
                  });
                }}
                entity={{
                  id: ballotDetails?.id,
                }}
                entityName="ballot"
                layer={2}
              />
            </Flex>
          </PageSection>
          <Space h="md" />
        </>
      )}

      <PageSection title="Scores">
        <Card withBorder p="xs" bdrs="md">
          <ScrollArea style={{ height: 350 }} scrollbarSize={6}>
            <Table highlightOnHover fz="xs" stickyHeader>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th width="25%">Role</Table.Th>
                  <Table.Th width="37.5%">{formatSide("p", caseType)}</Table.Th>
                  <Table.Th width="37.5%">{formatSide("d", caseType)}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>Opening</Table.Td>
                  <Table.Td>{scoreDisplay("p1")}</Table.Td>
                  <Table.Td>{scoreDisplay("d1")}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td colSpan={3}></Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <i>
                      <b>
                        P Witness #1 -{" "}
                        {
                          roundDetails?.witness_rounds.find(
                            (wr) => wr.role_type === "p1"
                          )?.witnesses?.name
                        }
                      </b>
                    </i>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Direct - Attorney</Table.Td>
                  <Table.Td>{scoreDisplay("p2")}</Table.Td>
                  <Table.Td></Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Direct - Witness</Table.Td>
                  <Table.Td>{scoreDisplay("p3")}</Table.Td>
                  <Table.Td></Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Cross</Table.Td>
                  <Table.Td>{scoreDisplay("p4")}</Table.Td>
                  <Table.Td>{scoreDisplay("d2")}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <i>
                      <b>
                        P Witness #2 -{" "}
                        {
                          roundDetails?.witness_rounds.find(
                            (wr) => wr.role_type === "p2"
                          )?.witnesses?.name
                        }
                      </b>
                    </i>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Direct - Attorney</Table.Td>
                  <Table.Td>{scoreDisplay("p5")}</Table.Td>
                  <Table.Td></Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Direct - Witness</Table.Td>
                  <Table.Td>{scoreDisplay("p6")}</Table.Td>
                  <Table.Td></Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Cross</Table.Td>
                  <Table.Td>{scoreDisplay("p7")}</Table.Td>
                  <Table.Td>{scoreDisplay("d3")}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <i>
                      <b>
                        P Witnesss #3 -{" "}
                        {
                          roundDetails?.witness_rounds.find(
                            (wr) => wr.role_type === "p3"
                          )?.witnesses?.name
                        }
                      </b>
                    </i>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Direct - Attorney</Table.Td>
                  <Table.Td>{scoreDisplay("p8")}</Table.Td>
                  <Table.Td></Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Direct - Witness</Table.Td>
                  <Table.Td>{scoreDisplay("p9")}</Table.Td>
                  <Table.Td></Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Cross</Table.Td>
                  <Table.Td>{scoreDisplay("p10")}</Table.Td>
                  <Table.Td>{scoreDisplay("d4")}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td colSpan={3}></Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <i>
                      <b>
                        D Witness #1 -{" "}
                        {
                          roundDetails?.witness_rounds.find(
                            (wr) => wr.role_type === "d1"
                          )?.witnesses?.name
                        }
                      </b>
                    </i>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Direct - Attorney</Table.Td>
                  <Table.Td></Table.Td>
                  <Table.Td>{scoreDisplay("d5")}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Direct - Witness</Table.Td>
                  <Table.Td></Table.Td>
                  <Table.Td>{scoreDisplay("d6")}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Cross</Table.Td>
                  <Table.Td>{scoreDisplay("p11")}</Table.Td>
                  <Table.Td>{scoreDisplay("d7")}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <i>
                      <b>
                        D Witness #2 -{" "}
                        {
                          roundDetails?.witness_rounds.find(
                            (wr) => wr.role_type === "d2"
                          )?.witnesses?.name
                        }
                      </b>
                    </i>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Direct - Attorney</Table.Td>
                  <Table.Td></Table.Td>
                  <Table.Td>{scoreDisplay("d8")}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Direct - Witness</Table.Td>
                  <Table.Td></Table.Td>
                  <Table.Td>{scoreDisplay("d9")}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Cross</Table.Td>
                  <Table.Td>{scoreDisplay("p12")}</Table.Td>
                  <Table.Td>{scoreDisplay("d10")}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <i>
                      <b>
                        D Witness #3 -{" "}
                        {
                          roundDetails?.witness_rounds.find(
                            (wr) => wr.role_type === "d3"
                          )?.witnesses?.name
                        }
                      </b>
                    </i>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Direct - Attorney</Table.Td>
                  <Table.Td></Table.Td>
                  <Table.Td>{scoreDisplay("d11")}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Direct - Witness</Table.Td>
                  <Table.Td></Table.Td>
                  <Table.Td>{scoreDisplay("d12")}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Cross</Table.Td>
                  <Table.Td>{scoreDisplay("p13")}</Table.Td>
                  <Table.Td>{scoreDisplay("d13")}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td colSpan={3}></Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Closing</Table.Td>
                  <Table.Td>{scoreDisplay("p14")}</Table.Td>
                  <Table.Td>{scoreDisplay("d14")}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Card>
      </PageSection>
    </BaseModal>
  );
}
