// Dependency imports
import { TextInput, Modal } from "@mantine/core";
import { useForm, hasLength } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";

// Component imports
import EntityHeader from "../components/EntityHeader";
import EditModal from "../components/EditModal";
import SingleSchoolTabs from "../components/tabs/SingleSchoolTabs";
import List from "../../../common/components/List";
import IconButton from "../../../common/components/IconButton";

// Utils imports
import { ROLES } from "../../../utils/constants";

// Hooks imports
import { useSchoolMutations } from "../../../hooks/api/useSchools";

export default function SingleSchoolView({
  selectedSchool,
  allSchoolTeams,
  allSchoolStudents,
  allSchoolTournaments,
  allSchoolUsers,
  currentTab,
  setCurrentTab,
}) {
  const { updateSchool } = useSchoolMutations();

  const [opened, { open, close }] = useDisclosure(false, {
    onOpen: () =>
      editSchoolForm.setValues({
        shortName: selectedSchool.schools.short_name,
      }),
    onClose: () => editSchoolForm.reset(),
  });

  const detailItems = [
    `Short Name: ${selectedSchool.schools.short_name}`,
    selectedSchool.role === ROLES.PRIMARY
      ? `Premium Status: ${
          selectedSchool.schools.is_premium ? "Active" : "Inactive"
        }`
      : "",
    `Your Role: ${
      selectedSchool.role === ROLES.PRIMARY
        ? "Primary Admin"
        : selectedSchool.role
    }`,
  ];

  const editSchoolForm = useForm({
    mode: "uncontrolled",
    validate: {
      shortName: hasLength({ min: 2, max: 10 }, "Must be 2-10 characters"),
    },
    validateInputOnBlur: true,
    onSubmitPreventDefault: "always",
  });

  async function handleEditSchoolSubmit (values) {
    try {
      if (values.shortName === selectedSchool.schools.short_name) {
        close();
        return;
      }

      await updateSchool({
        schoolId: selectedSchool.school_id,
        updates: {
          short_name: values.shortName,
        },
      });
      close();
    } catch (error) {
      console.error("Error updating school short name:", error);
    }
  };

  const schoolTabsProps = {
    role: selectedSchool.role,
    allTeams: allSchoolTeams,
    allStudents: allSchoolStudents,
    allTournaments: allSchoolTournaments,
    allUsers: allSchoolUsers,
    isPremium: selectedSchool.schools.is_premium,
    schoolId: selectedSchool.school_id,
    schoolName: selectedSchool.schools.name,
    currentTab,
    setCurrentTab,
  };

  const editModalProps = {
    opened,
    onClose: close,
    title: "Edit School",
    onSubmit: handleEditSchoolSubmit,
    form: editSchoolForm,
    fields: [
      {
        type: "text",
        name: "shortName",
        required: true,
        placeholder: "Enter the school's short name",
        autofocus: true,
        label: "Short Name",
      }
    ]
  }

  return (
    <>
      <EntityHeader title={selectedSchool.schools.name} canEdit={[ROLES.PRIMARY].includes(selectedSchool.role)} onEdit={open} />
      {[ROLES.PRIMARY].includes(selectedSchool.role) && (
        <EditModal {...editModalProps} />
      )}
      <List items={detailItems} />
      <br />
      <h2>School Details</h2>
      <SingleSchoolTabs {...schoolTabsProps} />
    </>
  );
}
