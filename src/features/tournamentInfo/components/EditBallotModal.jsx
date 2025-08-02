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
  TextInput,
  Flex,
  ActionIcon,
  useMantineTheme,
  Input,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useBallotDetails } from "../../../common/hooks/useBallotDetails";
import Loader from "../../../common/components/loader/GavelLoader";
import ShowIdText from "../../../common/components/ShowIdText";
import { LuPencil, LuTrash, LuX } from "react-icons/lu";
import DeleteConfirmationModal from "../../../common/components/modals/DeleteConfirmationModal";
//import { ViewScores } from "./ViewScores";

export default function EditBallotModal({
  opened,
  onClose,
  selected,
  role,
  tournamentStatus,
  stack,
}) {
  const ballot = selected;
  const theme = useMantineTheme();

  const [editMode, setEditMode] = useState(false);

  const [formValues, setFormValues] = useState({
    judgeName: "",
    scores: [
      { type: "p1", value: 0 },
      { type: "p2", value: 0 },
      { type: "p3", value: 0 },
      { type: "p4", value: 0 },
      { type: "p5", value: 0 },
      { type: "p6", value: 0 },
      { type: "p7", value: 0 },
      { type: "p8", value: 0 },
      { type: "p9", value: 0 },
      { type: "p10", value: 0 },
      { type: "p11", value: 0 },
      { type: "p12", value: 0 },
      { type: "p13", value: 0 },
      { type: "p14", value: 0 },
      { type: "d1", value: 0 },
      { type: "d2", value: 0 },
      { type: "d3", value: 0 },
      { type: "d4", value: 0 },
      { type: "d5", value: 0 },
      { type: "d6", value: 0 },
      { type: "d7", value: 0 },
      { type: "d8", value: 0 },
      { type: "d9", value: 0 },
      { type: "d10", value: 0 },
      { type: "d11", value: 0 },
      { type: "d12", value: 0 },
      { type: "d13", value: 0 },
      { type: "d14", value: 0 },
    ],
  });

  const {
    data: ballotDetails,
    isLoading: ballotLoading,
    addBallot,
    updateBallot,
    deleteBallot,
    addScores,
    updateScores,
  } = useBallotDetails(ballot);

  useEffect(() => {
    if (ballot && ballotDetails) {
      const updatedScores = [...formValues.scores];

      ballotDetails.scores.forEach((dbScore) => {
        const index = updatedScores.findIndex(
          (s) => s.type === dbScore.score_type
        );
        if (index !== -1) {
          updatedScores[index] = {
            type: dbScore.score_type,
            value: dbScore.score_value,
          };
        }
      });
      setFormValues({
        judgeName: ballotDetails.judge_name || "",
        scores: updatedScores,
      });
    }
  }, [ballotDetails]);

  if (ballotLoading)
    return (
      <Modal centered opened={opened} onClose={onClose} title="Loading...">
        <Loader />
      </Modal>
    );

  const adminTest = role === "admin" || role === "primary";

  return (
    <Modal centered opened={opened} onClose={onClose} title="Edit Ballot">
      <ShowIdText idName="Ballot" idValue={ballot} />

      {adminTest && tournamentStatus && (
        <ActionIcon onClick={() => setEditMode(!editMode)} mt="sm">
          {editMode ? <LuX /> : <LuPencil />}
        </ActionIcon>
      )}

      <TextInput
        label="Judge Name"
        value={formValues.judgeName}
        onChange={(e) => {
          editMode &&
            setFormValues({ ...formValues, judgeName: e.target.value });
        }}
        variant="filled"
      />
    </Modal>
  );
}
