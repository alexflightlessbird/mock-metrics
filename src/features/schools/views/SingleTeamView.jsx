import List from "../../../common/components/List";
import { Link } from "react-router-dom";
import { Checkbox, Flex, Text, TextInput, Modal, Select } from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { ROLES } from "../../../utils/constants";
import { EditIcon } from "../../../common/components/ActionIcons";
import IconButton from "../../../common/components/IconButton";
import { useSchoolDataMutations } from "../../../hooks/api/useSchoolData";
import Loading from "../../../common/components/Loading";

export default function SingleTeamView({ selectedTeam, schoolRole }) {
  const { updateTeam } = useSchoolDataMutations();

  const [opened, { open, close }] = useDisclosure(false, {
    onOpen: () => editTeamForm.setValues({
      name: selectedTeam.name,
      active: selectedTeam.is_active,
      type: selectedTeam.type,
    }),
    onClose: () => editTeamForm.reset(),
  });

  const editTeamForm = useForm({
    mode: "uncontrolled",
    validate: {
      name: hasLength({ min: 1, max: 15 }, "Must be 1-15 characters")
    },
    validateInputOnBlur: true,
    onSubmitPreventDefault: "always"
  });

  const handleEditTeamSubmit = async (values) => {
    const { name, active, type } = values;
    const originalName = selectedTeam.name;
    const originalActive = selectedTeam.is_active;
    const originalType = selectedTeam.type;

    const nameChanged = name !== originalName;
    const statusChanged = active !== originalActive;
    const typeChanged = type !== originalType;

    if (!nameChanged && !statusChanged && !typeChanged) {
      close();
      return;
    }

    try {
      await updateTeam({
        is_active: statusChanged ? active : undefined,
        name: nameChanged ? name : undefined,
        type: typeChanged ? type : undefined,
        schoolId: selectedTeam.school_id,
        teamId: selectedTeam.id,
      });
      close();
    } catch (error) {
      console.error("Team update failed:", error);
    }
  }

  const typeOptions = [
    { value: "Pre-Stack", label: "Pre-Stack" },
    { value: "Post-Stack", label: "Post-Stack" }
  ];

  const detailItems = [
    `Type: ${selectedTeam.type}`,
    `Status: ${selectedTeam.is_active ? "Active" : "Inactive"}`
  ];

  return (
    <>
      <Flex style={{ alignItems: "center", gap: "7px" }}>
        <h1>{selectedTeam.name}</h1>
        {(schoolRole === ROLES.PRIMARY || schoolRole === ROLES.ADMIN) && (
          <>
            <EditIcon onClick={open} />
            <Modal opened={opened} onClose={close} title="Edit Team" centered={true}>
              <form onSubmit = {editTeamForm.onSubmit(
                handleEditTeamSubmit,
                (errors) => {
                  const firstErrorPath = Object.keys(errors)[0];
                  editTeamForm.getInputNode(firstErrorPath)?.focus();
                }
              )}
              >
                <TextInput
                  data-autofocus
                  placeholder="Enter the team's name"
                  withAsterisk
                  label="Name"
                  {...editTeamForm.getInputProps("name")}
                />
                <br />
                <Select
                  label="Type"
                  allowDeselect={false}
                  data={typeOptions}
                  {...editTeamForm.getInputProps("type")}
                />
                <br />
                <Checkbox
                  label="Active"
                  style={{ cursor: "pointer" }}
                  {...editTeamForm.getInputProps("active", {
                    type: "checkbox"
                  })}
                />
                <br />
                <IconButton icon="save" type="submit" buttonText="Submit" />
              </form>
            </Modal>
          </>
        )}
      </Flex>
      <List items={detailItems} />
    </>
  );
}
