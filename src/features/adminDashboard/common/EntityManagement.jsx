import { useState } from "react";
import { Container, Flex } from "@mantine/core";
import SearchBar from "../../../common/components/SearchBar";
import { capitalize } from "../../../common/utils/helpers";
import Loader from "../../../common/components/loader/GavelLoader";

export default function EntityManagement({
  entityName,
  columns,
  searchPlaceholder,
  useEntityData,
  useEntityFilter,
  TableComponent,
  AddModalComponent,
  EditModalComponent,
  DeleteModalComponent,
  addEnabled = true,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");
  const [selectedEntity, setSelectedEntity] = useState(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const entityData = useEntityData();

  const getCrudFunctions = () => {
    const prefix = entityName.toLowerCase();
    return {
      data: entityData[prefix + "s"] || entityData.data || [],
      isLoading: entityData.isLoading || false,
      addEntity: addEnabled
        ? entityData["add" + capitalize(prefix)]
        : undefined,
      updateEntity: entityData["update" + capitalize(prefix)],
      deleteEntity: entityData["delete" + capitalize(prefix)],
    };
  };

  const { data, isLoading, addEntity, updateEntity, deleteEntity } =
    getCrudFunctions();
  const filteredData = useEntityFilter({ data, searchTerm, searchColumn });

  const handleEntitySelect = (entity, action) => {
    setSelectedEntity(entity);
    switch (action) {
      case "edit":
        setEditModalOpen(true);
        break;
      case "delete":
        setDeleteModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleResetSearch = () => {
    setSearchTerm("");
    setSearchColumn("all");
  };

  if (isLoading)
    return (
      <Container fluid px={0}>
        <Flex justify="center" mt="xs">
          <Loader key={`${entityName}-loader-animation`} scale={1.5} />
        </Flex>
      </Container>
    );

  return (
    <Container fluid px={0}>
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder={searchPlaceholder}
        columns={columns}
        selectedColumnn={searchColumn}
        onColumnChange={setSearchColumn}
        onReset={handleResetSearch}
        addEnabled={addEnabled}
        onAdd={() => setAddModalOpen(true)}
        addName={capitalize(entityName)}
      />

      {TableComponent && (
        <TableComponent data={filteredData} onSelect={handleEntitySelect} />
      )}

      {AddModalComponent && addEntity && addModalOpen && (
        <AddModalComponent
          opened={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSubmit={addEntity}
        />
      )}

      {EditModalComponent && updateEntity && editModalOpen && (
        <EditModalComponent
          opened={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          selected={selectedEntity}
          onSubmit={updateEntity}
        />
      )}

      {DeleteModalComponent && deleteEntity && deleteModalOpen && (
        <DeleteModalComponent
          opened={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          selected={selectedEntity}
          onSubmit={(id) =>
            deleteEntity(id).finally(() => setDeleteModalOpen(false))
          }
        />
      )}
    </Container>
  );
}
