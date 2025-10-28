import { useSessionStorage } from "@mantine/hooks";
import { useModal } from "../../../context/ModalContext";
import {
  Button,
  Group,
  NumberInput,
  Stack,
  Table,
  Text,
  TextInput,
  Card,
  ScrollArea,
} from "@mantine/core";
import { formatSide } from "../../../common/utils/helpers";
import BaseModal from "../../../common/components/modals-new/BaseModal";
import { useRoundDetails } from "../../../common/hooks/useRoundDetails";
import { useBallotDetails } from "../../../common/hooks/useBallotDetails";

export default function AddBallotModal({ trigger, roundId, caseType }) {
  const [formData, setFormData] = useSessionStorage({
    key: `add-ballot-modal-${roundId}`,
    defaultValue: {
      judgeName: "",
      p1: 0,
      p2: 0,
      p3: 0,
      p4: 0,
      p5: 0,
      p6: 0,
      p7: 0,
      p8: 0,
      p9: 0,
      p10: 0,
      p11: 0,
      p12: 0,
      p13: 0,
      p14: 0,
      d1: 0,
      d2: 0,
      d3: 0,
      d4: 0,
      d5: 0,
      d6: 0,
      d7: 0,
      d8: 0,
      d9: 0,
      d10: 0,
      d11: 0,
      d12: 0,
      d13: 0,
      d14: 0,
    },
  });

  const { closeModal } = useModal();
  const { addBallot } = useBallotDetails();

  const { data: roundDetails, isLoading: roundLoading } =
    useRoundDetails(roundId);

  if (roundLoading) return;

  const validateForm = () => {
    return (
      formData.judgeName.trim() !== "" &&
      Object.values(formData)
        .slice(1)
        .every((score) => score >= 0 && score <= 10)
    );
  };

  const handleReset = () => {
    setFormData({
      judgeName: "",
      p1: 0,
      p2: 0,
      p3: 0,
      p4: 0,
      p5: 0,
      p6: 0,
      p7: 0,
      p8: 0,
      p9: 0,
      p10: 0,
      p11: 0,
      p12: 0,
      p13: 0,
      p14: 0,
      d1: 0,
      d2: 0,
      d3: 0,
      d4: 0,
      d5: 0,
      d6: 0,
      d7: 0,
      d8: 0,
      d9: 0,
      d10: 0,
      d11: 0,
      d12: 0,
      d13: 0,
      d14: 0,
    });
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    addBallot({
      judgeName: formData.judgeName,
      roundId,
      scores: Object.fromEntries(
        Object.entries(formData).filter(([key]) => key !== "judgeName")
      ),
    });

    handleReset();
    closeModal(`add-ballot-modal-${roundId}`);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const scoreInput = (inputName) => {
    return (
      <NumberInput
        value={formData[inputName]}
        min={0}
        max={10}
        size="sm"
        onChange={(value) => handleInputChange(inputName, value)}
      />
    );
  };

  const totalScore = (side) => {
    let total = 0;
    Object.entries(formData).forEach(([key, value]) => {
      if (key.startsWith(side)) {
        total += value;
      }
    });
    return total;
  };

  const pages = [
    <Stack key={0} style={{ userSelect: "none", WebkitUserSelect: "none" }}>
      <TextInput
        label="Judge Name"
        value={formData.judgeName}
        onChange={(event) =>
          handleInputChange("judgeName", event.currentTarget.value)
        }
      />

      <Card withBorder p="xs" bdrs="md">
        <ScrollArea style={{ height: 350 }} scrollbarSize={6}>
          <Table highlightOnHover fz="xs" stickyHeader>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Role</Table.Th>
                <Table.Th>
                  {formatSide("p", caseType)} ({totalScore("p")})
                </Table.Th>
                <Table.Th>
                  {formatSide("d", caseType)} ({totalScore("d")})
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>Opening</Table.Td>
                <Table.Td>{scoreInput("p1")}</Table.Td>
                <Table.Td>{scoreInput("d1")}</Table.Td>
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
                <Table.Td>{scoreInput("p2")}</Table.Td>
                <Table.Td></Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Direct - Witness</Table.Td>
                <Table.Td>{scoreInput("p3")}</Table.Td>
                <Table.Td></Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Cross</Table.Td>
                <Table.Td>{scoreInput("p4")}</Table.Td>
                <Table.Td>{scoreInput("d2")}</Table.Td>
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
                <Table.Td>{scoreInput("p5")}</Table.Td>
                <Table.Td></Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Direct - Witness</Table.Td>
                <Table.Td>{scoreInput("p6")}</Table.Td>
                <Table.Td></Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Cross</Table.Td>
                <Table.Td>{scoreInput("p7")}</Table.Td>
                <Table.Td>{scoreInput("d3")}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td colSpan={3}>
                  <i>
                    <b>
                      P Witness #3 -{" "}
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
                <Table.Td>{scoreInput("p8")}</Table.Td>
                <Table.Td></Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Direct - Witness</Table.Td>
                <Table.Td>{scoreInput("p9")}</Table.Td>
                <Table.Td></Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Cross</Table.Td>
                <Table.Td>{scoreInput("p10")}</Table.Td>
                <Table.Td>{scoreInput("d4")}</Table.Td>
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
                <Table.Td>{scoreInput("d5")}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Direct - Witness</Table.Td>
                <Table.Td></Table.Td>
                <Table.Td>{scoreInput("d6")}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Cross</Table.Td>
                <Table.Td>{scoreInput("p11")}</Table.Td>
                <Table.Td>{scoreInput("d7")}</Table.Td>
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
                <Table.Td>{scoreInput("d8")}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Direct - Witness</Table.Td>
                <Table.Td></Table.Td>
                <Table.Td>{scoreInput("d9")}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Cross</Table.Td>
                <Table.Td>{scoreInput("p12")}</Table.Td>
                <Table.Td>{scoreInput("d10")}</Table.Td>
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
                <Table.Td>{scoreInput("d11")}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Direct - Witness</Table.Td>
                <Table.Td></Table.Td>
                <Table.Td>{scoreInput("d12")}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Cross</Table.Td>
                <Table.Td>{scoreInput("p13")}</Table.Td>
                <Table.Td>{scoreInput("d13")}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td colSpan={3}></Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Closing</Table.Td>
                <Table.Td>{scoreInput("p14")}</Table.Td>
                <Table.Td>{scoreInput("d14")}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>
    </Stack>,
  ];

  return (
    <BaseModal
      modalId={`add-ballot-modal-${roundId}`}
      title={roundLoading ? "Loading..." : "Add Ballot"}
      trigger={trigger}
      layer={1}
      footer={
        <>
          <Group justify="space-between">
            <Button onClick={handleReset}>Reset</Button>
            <Button onClick={handleSubmit} disabled={!validateForm()}>
              Submit
            </Button>
          </Group>
        </>
      }
    >
      <Text size="sm" weight={500} mb="md">
        Ensure you are entering everything correctly. This information cannot be
        changed after being submitted, and to make adjustments to the scores you
        will need to delete the ballot entirely.
      </Text>
      {pages}
    </BaseModal>
  );
}
