import { Table, Button, Text, Stack } from "@mantine/core";
import { useState } from "react";
import {
  EditDeleteTableActions,
  ConfirmCancelTableActions,
} from "../../../../common/components/tables/TableActions";
import { splitSlash as splitType } from "../../../../common/utils/helpers";
import { WITNESS_COLUMNS } from "../../common/columns";
import DeleteConfirmationModal from "../../../../common/components/modals/DeleteConfirmationModal";
import DataTable from "../../../../common/components/tables/DataTable";
import { NameField, WitnessSideField, WitnessTypeField } from "../../common/FormFields";

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
          <NameField
            value={editValues.name}
            onChange={(e) => setEditValues((v) => ({ ...v, name: e.target.value }))}
            label=""
            space={false}
          />
        ) : (
          witness.name || "-"
        )}
      </Table.Td>
      <Table.Td>
        {editWitnessId === witness.id ? (
          <WitnessSideField
            value={editValues.side}
            onChange={(e) => setEditValues((v) => ({ ...v, side: e }))}
            pSide={caseType === "criminal" ? "prosecution" : caseType === "civil" ? "plaintiff" : ""}
            label=""
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
          <WitnessTypeField
            value={editValues.type}
            onChange={(e) => setEditValues((v) => ({ ...v, type: e }))}
            label=""
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
            size="md"
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

  return (
    <Stack>
      <NameField
        value={formValues.name}
        onChange={(e) => setFormValues((v) => ({ ...v, name: e.target.value }))}
        space={false}
      />
      <WitnessSideField
        value={formValues.side}
        onChange={(e) => setFormValues((v) => ({ ...v, side: e }))}
        pSide={caseType === "criminal" ? "prosecution" : caseType === "civil" ? "plaintiff" : ""}
      />
      <WitnessTypeField
        value={formValues.type}
        onChange={(e) => setFormValues((v) => ({ ...v, type: e }))}
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
