import List from "../../../common/components/List";
import { hasLength, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { ROLES } from "../../../utils/constants";
import { TYPES } from "../utils/schoolConstants";
import { useSchoolDataMutations } from "../../../hooks/api/useSchoolData";
import EntityHeader from "../components/EntityHeader";
import EditModal from "../components/EditModal";

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
    { value: TYPES.PRESTACK, label: TYPES.PRESTACK },
    { value: TYPES.POSTSTACK, label: TYPES.POSTSTACK }
  ];

  const detailItems = [
    `Type: ${selectedTeam.type}`,
    `Status: ${selectedTeam.is_active ? "Active" : "Inactive"}`
  ];

  const editModalProps = {
    opened,
    onClose: close,
    title: "Edit Team",
    onSubmit: handleEditTeamSubmit,
    form: editTeamForm,
    fields: [
      {
        type: "text",
        name: "name",
        autofocus: true,
        placeholder: "Enter the team's name",
        required: true,
        label: "Name"
      },
      {
        type: "select",
        name: "type",
        required: true,
        label: "Type",
        options: typeOptions
      },
      {
        type: "checkbox",
        name: "active",
        label: "Active"
      }
    ]
  }

  return (
    <>
      <EntityHeader title={selectedTeam.name} canEdit={[ROLES.PRIMARY, ROLES.ADMIN].includes(schoolRole)} onEdit={open} />
      {(schoolRole === ROLES.PRIMARY || schoolRole === ROLES.ADMIN) && (
        <EditModal {...editModalProps} />
      )}
      <List items={detailItems} />
    </>
  );
}
