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
  NumberInput,
  ActionIcon,
  Tooltip
} from "@mantine/core";
import { useBallotDetails } from "../../../common/hooks/useBallotDetails";
import ShowIdText from "../../../common/components/ShowIdText";
import { LuTrash, LuPencil as LuEdit, LuWeight } from "react-icons/lu";
import DeleteConfirmationModal from "../../../common/components/modals-new/DeleteConfirmationModal";
import BaseModal from "../../../common/components/modals-new/BaseModal";
import PageSection from "../../../common/components/PageSection";
import { formatSide } from "../../../common/utils/helpers";
import { useRoundDetails } from "../../../common/hooks/useRoundDetails";
import { useState } from "react";

export default function BallotManagementModal({
  selected,
  roundId,
  caseType,
  role,
  trigger,
  teamName,
}) {
  const ballot = selected;
  const [editingWeight, setEditingWeight] = useState(null);
  const [weightValue, setWeightValue] = useState(1);

  const {
    data: ballotDetails,
    isLoading: ballotLoading,
    deleteBallot,
    udpateScoreWeight
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

  const scoreWeight = (scoreType) => {
    return (
      ballotDetails?.scores?.find((s) => s.score_type === scoreType)
        ?.weight || 1
    );
  };

  const hasCustomWeights = () => {
    return ballotDetails?.scores?.some((score) => score.weight !== 1);
  };

  const handleWeightEdit = (scoreType, currentWeight) => {
    setEditingWeight(scoreType);
    setWeightValue(currentWeight);
  };

  const handleWeightSave = async (scoreType) => {
    if (weightValue >= 0 && weightValue <= 1) {
      await udpateScoreWeight({
        ballotId: ballotDetails?.id,
        scoreType,
        weight: parseFloat(weightValue.toFixed(2)),
      });
      setEditingWeight(null);
      setWeightValue(1);
    }
  };

  const handleWeightCancel = () => {
    setEditingWeight(null);
    setWeightValue(1);
  };

  const WeightEditor = ({ scoreType }) => {
    const currentWeight = scoreWeight(scoreType);
    const isEditing = editingWeight === scoreType;

    const shouldShow = isEditing ||
      (role === "admin" || role === "primary") ||
      currentWeight !== 1 ||
      hasCustomWeights();

    if (!shouldShow) {
      return null;
    }

    return (
      <Group gap="xs" justify="flex-end">
        {isEditing ? (
          <Group gap="xs">
            <NumberInput
              size="xs"
              min={0}
              max={1}
              step={0.01}
              value={weightValue}
              onChange={setWeightValue}
              decimalScale={2}
              fixedDecimalScale
            />
            <Button size="xs" variant="light" onClick={() => handleWeightSave(scoreType)}>Save</Button>
            <Button size="xs" variant="subtle" onClick={handleWeightCancel}>Cancel</Button>
          </Group>
        ) : (
          <Group gap="xs">
            <Text size="sm" c={currentWeight !== 1 ? "blue" : "dimmed"}>
              {currentWeight}x
            </Text>
            {(role === "admin" || role === "primary") && (
              <Tooltip label="Edit weight">
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  onClick={() => handleWeightEdit(scoreType, currentWeight)}
                >
                  <LuEdit size={14} />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        )}
      </Group>
    );
  };

  const ScoreRow = ({ label, pScore, dScore, showWeights = true }) => (
    <Table.Tr>
      <Table.Td>{label}</Table.Td>
      <Table.Td>
        {pScore && (
          <Group justify="space-between">
            {scoreDisplay(pScore)}
            {showWeights && pScore && <WeightEditor scoreType={pScore} />}
          </Group>
        )}
      </Table.Td>
      <Table.Td>
        {dScore && (
          <Group justify="space-between">
            {scoreDisplay(dScore)}
            {showWeights && dScore && <WeightEditor scoreType={dScore} />}
          </Group>
        )}
      </Table.Td>
    </Table.Tr>
  );

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
        <Group justify="space-between">
          <Text c="dimmed" fz="xs">
            Last Updated:{" "}
            {new Date(ballotDetails?.updated_at + "Z").toLocaleString()}
          </Text>
          {hasCustomWeights() && (
            <Tooltip label="This ballot has custom score weights applied">
              <Group gap="xs">
                <LuWeight size={16} />
                <Text fz="xs" c="dimmed">Custom Weights Applied</Text>
              </Group>
            </Tooltip>
          )}
        </Group>
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
                <ScoreRow label="Opening" pScore="p1" dScore="d1" />

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
                
                <ScoreRow label="Direct - Attorney" pScore="p2" />
                <ScoreRow label="Direct - Witness" pScore="p3" />
                <ScoreRow label="Cross" pScore="p4" dScore="d2" />

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
                
                <ScoreRow label="Direct - Attorney" pScore="p5" />
                <ScoreRow label="Direct - Witness" pScore="p6" />
                <ScoreRow label="Cross" pScore="p7" dScore="d3" />

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

                <ScoreRow label="Direct - Attorney" pScore="p8" />
                <ScoreRow label="Direct - Witness" pScore="p9" />
                <ScoreRow label="Cross" pScore="p10" dScore="d4" />

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
                
                <ScoreRow label="Direct - Attorney" dScore="d5" />
                <ScoreRow label="Direct - Witness" dScore="d6" />
                <ScoreRow label="Cross" pScore="p11" dScore="d7" />

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

                <ScoreRow label="Direct - Attorney" dScore="d8" />
                <ScoreRow label="Direct - Witness" dScore="d9" />
                <ScoreRow label="Cross" pScore="p12" dScore="d10" />

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

                <ScoreRow label="Direct - Attorney" dScore="d11" />
                <ScoreRow label="Direct - Witness" dScore="d12" />
                <ScoreRow label="Cross" pScore="p13" dScore="d13" />

                <Table.Tr>
                  <Table.Td colSpan={3}></Table.Td>
                </Table.Tr>
                
                <ScoreRow label="Closing" pScore="p14" dScore="d14" />
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Card>
      </PageSection>
    </BaseModal>
  );
}
