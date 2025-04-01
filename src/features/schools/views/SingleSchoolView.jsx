import List from "../../../common/components/List";
import SingleSchoolTabs from "../components/tabs/SingleSchoolTabs";
import { useSchoolMutations } from "../../../hooks/api/useSchools";
import { Flex, TextInput, Modal } from "@mantine/core";
import { useForm, hasLength } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { ROLES } from "../../../utils/constants";
import { EditIcon } from "../../../common/components/ActionIcons";
import IconButton from "../../../common/components/IconButton";

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

  const handleEditSchoolSubmit = async (values) => {
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

  return (
    <>
      <Flex style={{ alignItems: "center", gap: "7px" }}>
        <h1>{selectedSchool.schools.name}</h1>
        {selectedSchool.role === ROLES.PRIMARY && (
          <>
            <EditIcon onClick={open} />
            <Modal opened={opened} onClose={close} title="Edit School" centered>
              <form
                onSubmit={editSchoolForm.onSubmit(
                  handleEditSchoolSubmit,
                  (errors) => {
                    const firstErrorPath = Object.keys(errors)[0];
                    editSchoolForm.getInputNode(firstErrorPath)?.focus();
                  }
                )}
              >
                <TextInput
                  data-autofocus
                  label="Short Name"
                  withAsterisk
                  placeholder="Enter the school's short name"
                  {...editSchoolForm.getInputProps("shortName")}
                />
                <br />
                <IconButton type="submit" icon="save" buttonText="Submit" />
              </form>
            </Modal>
          </>
        )}
      </Flex>
      <List items={detailItems} />
      <br />
      <h2>School Details</h2>
      <SingleSchoolTabs {...schoolTabsProps} />
    </>
  );
}
