import React from "react";
import { supabase } from "../../services/supabaseClient";
import List from "../common/List";
import { Link } from "react-router-dom";
import { Checkbox, Flex, Text, TextInput, Modal } from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { ROLES } from "../../utils/constants";
import { EditIcon } from "../common/ActionIcons";
import IconButton from "../common/buttons/NewIconButton";

export default function SingleStudent({
  selectedSchool,
  selectedStudent,
  allTeams,
  allStudentTeams,
  triggerReload,
}) {
  const [opened, { open, close }] = useDisclosure(false, {
    onOpen: () =>
      editStudentForm.setValues({
        name: selectedStudent.name,
        active: selectedStudent.is_active,
      }),
    onClose: () => editStudentForm.reset(),
  });
  const schoolItem = (
    <Link to={`/schools?id=${selectedSchool.schools.id}`}>
      {selectedSchool.schools.name}
    </Link>
  );

  const detailItems = [
    `Name: ${selectedStudent.name}`,
    <Text>School: {schoolItem}</Text>,
    `Status: ${selectedStudent.is_active ? "Active" : "Inactive"}`,
  ];

  const editStudentForm = useForm({
    mode: "uncontrolled",
    validate: {
      name: hasLength(
        { min: 2, max: 40 },
        "Name must be between 2 and 40 characters"
      ),
    },
    validateInputOnBlur: true,
    onSubmitPreventDefault: "always",
  });

  const handleEditStudentSubmit = async (values) => {
    console.log(values);
  };

  return (
    <>
      <h1>{selectedStudent.name}</h1>
      <Flex style={{ alignItems: "center", gap: "7px" }}>
        <h2>Student Details</h2>
        {(selectedSchool.role === ROLES.PRIMARY ||
          selectedSchool.role === ROLES.ADMIN) && (
          <>
            <EditIcon onClick={open} />
            <Modal opened={opened} onClose={close} title="Edit Student Details">
              <form
                onSubmit={editStudentForm.onSubmit(
                  handleEditStudentSubmit,
                  (errors) => {
                    const firstErrorPath = Object.keys(errors)[0];
                    editStudentForm.getInputNode(firstErrorPath)?.focus();
                  }
                )}
              >
                <TextInput
                  data-autofocus
                  placeholder="Enter the student's name"
                  withAsterisk
                  label="Name"
                  {...editStudentForm.getInputProps("name")}
                />
                <br />
                <Checkbox
                  label="Active"
                  style={{ cursor: "pointer" }}
                  {...editStudentForm.getInputProps("active", {
                    type: "checkbox",
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
