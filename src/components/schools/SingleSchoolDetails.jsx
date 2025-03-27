import React from "react";
import List from "../common/List";
import { Flex, TextInput, Modal, FocusTrap } from "@mantine/core";
import { useForm, hasLength } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { ROLES } from "../../utils/constants";
import { EditIcon } from "../common/ActionIcons";
import IconButton from "../common/buttons/NewIconButton";
import SchoolTabs from "./SchoolTabs";
import { useSchoolMutations } from "../../hooks/api/useSchools";

export default function SingleSchoolDetails({
  selectedSchool,
  allUsers = [],
  allStudents = [],
  allTeams = [],
  allTournaments = [],
  currentTab = "teams",
  setCurrentTab,
  pending = {teams: false, students: false, tournaments: false, users: false, studentTeams: false}
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
      ? `Premium Status: ${selectedSchool.schools.is_premium ? "Active" : "Inactive"}`
      : "",
    `Your Role: ${selectedSchool.role === ROLES.PRIMARY ? "Primary Admin" : selectedSchool.role}`
  ];

  const editSchoolForm = useForm({
    mode: "uncontrolled",
    validate: {
      shortName: hasLength({ min: 2, max: 10 }, "Must be 2-10 characters")
    },
    validateInputOnBlur: true,
    onSubmitPreventDefault: "always"
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
          short_name: values.shortName
        }
      });
      close();
    } catch (error) {
      console.error("Error updating school short name:", error);
    }
  }

  const schoolTabsProps = {
    role: selectedSchool.role,
    allUsers,
    allTeams,
    allStudents,
    allTournaments,
    isPremium: selectedSchool.schools.is_premium,
    schoolId: selectedSchool.school_id,
    schoolName: selectedSchool.schools.name,
    currentTab,
    setCurrentTab,
    pending,
  };

  return (
    <>
      <h1>{selectedSchool.schools.name}</h1>
      <Flex style={{ alignItems: "center", gap: "7px" }}>
        <h2>School Details</h2>
        {selectedSchool.role === ROLES.PRIMARY && (
          <>
            <EditIcon onClick={open} />
            <Modal opened={opened} onClose={close} title="Edit School Details" centered={true}>
              <form onSubmit={editSchoolForm.onSubmit(handleEditSchoolSubmit, (errors) => { const firstErrorPath = Object.keys(errors)[0]; editSchoolForm.getInputNode(firstErrorPath)?.focus();})}>
                <TextInput
                  data-autofocus
                  label="Short Name"
                  withAsterisk
                  placeholder="Enter the school's short name"
                  {...editSchoolForm.getInputProps("shortName")}
                />
                <br />
                <IconButton icon="save" type="submit" buttonText="Submit" ></IconButton>
              </form>
            </Modal>
          </>
        )}
      </Flex>
      <List items={detailItems} />
      <br />

      <SchoolTabs {...schoolTabsProps} />
    </>
  )
}