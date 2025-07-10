import { Table, Button, Text, Select, Stack, TextInput } from "@mantine/core";
import { useState } from "react";
import {
  EditDeleteTableActions,
  ConfirmCancelTableActions,
} from "../../../../common/components/tables/TableActions";
import { splitSlash as splitType } from "../../../../common/utils/helpers";
import { WITNESS_COLUMNS } from "../../common/columns";
import DeleteConfirmationModal from "../../../../common/components/modals/DeleteConfirmationModal";
import DataTable from "../../../../common/components/tables/DataTable";

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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteWitnessId, setDeleteWitnessId] = useState(null);
  const [deleteWitnessName, setDeleteWitnessName] = useState(null);

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

  const handleDeleteStart = (witness) => {
    setDeleteWitnessId(witness.id);
    setDeleteWitnessName(witness.name);
    setDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteWitnessId(null);
    setDeleteWitnessName(null);
  };

  const handleDeleteSubmit = (id) => {
    onRemove(id);
    setDeleteModalOpen(false);
    setDeleteWitnessId(null);
    setDeleteWitnessName(null);
  };

  const renderRow = (witness) => (
    <Table.Tr key={witness.id}>
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
            onChange={(value) => setEditValues((v) => ({ ...v, side: value }))}
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
            onChange={(value) => setEditValues((v) => ({ ...v, type: value }))}
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
        {editWitnessId === witness.id ? (
          <ConfirmCancelTableActions
            onConfirm={() => handleEditSubmit(witness.id)}
            onCancel={handleEditCancel}
            size="lg"
          />
        ) : (
          <EditDeleteTableActions
            onDelete={() => handleDeleteStart(witness)}
            onEdit={() => handleEditStart(witness)}
            size="lg"
            canDelete={true}
          />
        )}
      </Table.Td>
    </Table.Tr>
  );

  return (
    <>
      <DataTable
        columns={WITNESS_COLUMNS}
        data={witnesses}
        emptyMessage="No witnesses assigned to this case"
        renderRow={renderRow}
        scrollContainer={true}
        scrollContainerHeight="30vh"
      />
      <DeleteConfirmationModal
        opened={deleteModalOpen}
        entityName="witness"
        entity={{ id: deleteWitnessId, name: deleteWitnessName }}
        onClose={handleDeleteCancel}
        onSubmit={() => handleDeleteSubmit(deleteWitnessId)}
      />
    </>
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
