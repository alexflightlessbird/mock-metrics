import {
  Table,
  Button,
  Text,
  Select,
  Stack,
  Flex,
  ActionIcon,
  TextInput,
} from "@mantine/core";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineCheck,
  AiOutlineClose,
} from "react-icons/ai";
import { useState } from "react";

const splitType = (type) => {
  if (!type) return "-";
  const parts = type.split("/");

  return (
    <span>
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 && (
            <>
              /
              <wbr />
            </>
          )}
        </span>
      ))}
    </span>
  );
};

const typeOptions = [
  { value: "character", label: "Character" },
  { value: "expert", label: "Expert" },
  { value: "party rep", label: "Party Rep" },
  { value: "police/investigator", label: "Police/Investigator" },
  { value: "other", label: "Other" },
];

export function ViewWitnesses({
  witnesses,
  onRemove,
  onUpdate,
  editWitnessId,
  setEditWitnessId,
  caseType,
}) {
  const [editValues, setEditValues] = useState({});

  if (!witnesses?.length)
    return <Text>No witnesses assigned to this case</Text>;

  const sideOptions = [
    {
      value: "p",
      label:
        caseType === "criminal"
          ? "Prosecution"
          : caseType === "civil"
          ? "Plaintiff"
          : "Plaintiff/Prosecution",
    },
    { value: "d", label: "Defense" },
    { value: "s", label: "Swing" },
  ];

  const handleEditStart = (witness) => {
    setEditWitnessId(witness.id);
    setEditValues({
      name: witness.name,
      side: witness.side,
      type: witness.type,
    });
  };

  const handleEditCancel = () => {
    setEditWitnessId(null);
    setEditValues({});
  };

  const handleEditSubmit = (id) => {
    onUpdate({ id, updates: editValues });
    setEditWitnessId(null);
    setEditValues({});
  };

  return (
    <Table
      striped
      highlightOnHover
      withTableBorder
      withColumnBorders
      stickyHeader
      style={{ cursor: "default" }}
      fz="xs"
    >
      <Table.Thead>
        <Table.Tr>
          <Table.Th>ID</Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th>Side</Table.Th>
          <Table.Th>Type</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {witnesses.map((witness) => (
          <Table.Tr key={witness.id}>
            <Table.Td style={{ wordBreak: "break-all" }}>{witness.id}</Table.Td>
            <Table.Td>
              {editWitnessId === witness.id ? (
                <TextInput
                  value={editValues.name}
                  onChange={(e) =>
                    setEditValues((v) => ({ ...v, name: e.target.value }))
                  }
                />
              ) : (
                witness.name || "-"
              )}
            </Table.Td>
            <Table.Td>
              {editWitnessId === witness.id ? (
                <Select
                  data={sideOptions}
                  value={editValues.side}
                  onChange={(value) =>
                    setEditValues((v) => ({ ...v, side: value }))
                  }
                />
              ) : witness.side === "p" ? (
                caseType === "criminal" ? (
                  "Prosecution"
                ) : caseType === "civil" ? (
                  "Plaintiff"
                ) : (
                  "Plaintiff/Prosecution"
                )
              ) : witness.side === "d" ? (
                "Defense"
              ) : witness.side === "s" ? (
                "Swing"
              ) : (
                "-"
              )}
            </Table.Td>
            <Table.Td>
              {editWitnessId === witness.id ? (
                <Select
                  data={typeOptions}
                  value={editValues.type}
                  onChange={(value) =>
                    setEditValues((v) => ({ ...v, type: value }))
                  }
                />
              ) : witness.type === "expert" ? (
                "Expert"
              ) : witness.type === "character" ? (
                "Character"
              ) : witness.type === "party rep" ? (
                "Party Rep"
              ) : witness.type === "police/investigator" ? (
                splitType("Police/Investigator")
              ) : witness.type === "other" ? (
                "Other"
              ) : (
                "-"
              )}
            </Table.Td>
            <Table.Td>
              <Flex wrap="wrap" rowGap="xs" columnGap="xs">
                {editWitnessId === witness.id ? (
                  <>
                    <ActionIcon
                      size="lg"
                      onClick={() => handleEditSubmit(witness.id)}
                    >
                      <AiOutlineCheck />
                    </ActionIcon>
                    <ActionIcon
                      color="gray"
                      size="lg"
                      onClick={handleEditCancel}
                    >
                      <AiOutlineClose />
                    </ActionIcon>
                  </>
                ) : (
                  <>
                    <ActionIcon
                      size="lg"
                      onClick={() => handleEditStart(witness)}
                    >
                      <AiOutlineEdit />
                    </ActionIcon>
                    <ActionIcon size="lg" onClick={() => onRemove(witness.id)}>
                      <AiOutlineDelete />
                    </ActionIcon>
                  </>
                )}
              </Flex>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}

export function AddWitness({ onSubmit, isLoading, caseType, setType }) {
  const [formValues, setFormValues] = useState({
    name: "",
    side: "p",
    type: "character",
  });

  const sideOptions = [
    {
      value: "p",
      label:
        caseType === "criminal"
          ? "Prosecution"
          : caseType === "civil"
          ? "Plaintiff"
          : "Plaintiff/Prosecution",
    },
    { value: "d", label: "Defense" },
    { value: "s", label: "Swing" },
  ];

  return (
    <Stack>
      <TextInput
        value={formValues.name}
        onChange={(e) => setFormValues((v) => ({ ...v, name: e.target.value }))}
        label="Name"
        required
      />
      <Select
        label="Side"
        data={sideOptions}
        value={formValues.side}
        onChange={(value) => setFormValues((v) => ({ ...v, side: value }))}
        allowDeselect={false}
      />
      <Select
        label="Type"
        data={typeOptions}
        value={formValues.type}
        onChange={(value) => setFormValues((v) => ({ ...v, type: value }))}
        allowDeselect={false}
      />
      <Button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          if (formValues.name) {
            onSubmit(formValues);
            setFormValues({
              name: "",
              side: "p",
              type: "character",
            });
            setType("view");
          }
        }}
        disabled={!formValues.name}
        loading={isLoading}
      >
        Submit
      </Button>
    </Stack>
  );
}
