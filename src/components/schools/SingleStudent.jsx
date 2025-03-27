import React from "react";
import { supabase } from "../../services/supabaseClient";
import List from "../common/List";
import { Link } from "react-router-dom";
import { Checkbox, Flex, Text, TextInput } from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
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
    initialValues: {
      name: selectedStudent.name || "",
      active: selectedStudent.is_active || false,
    },
    validate: {
      name: hasLength(
        { min: 2, max: 40 },
        "Names must be 2-40 characters long"
      ),
    },
    validateInputOnBlur: true,
    onSubmitPreventDefault: "always",
  });

  const handleEditStudentSubmit = async (values) => {
    console.log(values);
  };

  const editStudentModal = () => {
    editStudentForm.reset();
    editStudentForm.setInitialValues({
      name: selectedStudent.name,
      active: selectedStudent.is_active,
    });

    editStudentForm.setValues({
      name: selectedStudent.name,
      active: selectedStudent.is_active,
    });

    modals.open({
      title: "Edit Student Details",
      children: (
        <>
          <form onSubmit={editStudentForm.onSubmit(handleEditStudentSubmit)}>
            <TextInput
              label="Name"
              withAsterisk
              key={editStudentForm.key("name")}
              placeholder="Enter the student's name"
              {...editStudentForm.getInputProps("name")}
            />
            <br />
            <Checkbox
              label="Active"
              key={editStudentForm.key("active")}
              style={{ cursor: "pointer" }}
              {...editStudentForm.getInputProps("active")}
            />
            <br />
            <IconButton icon="save" type="submit" buttonText="Submit" />
          </form>
        </>
      ),
    });
  };

  return (
    <>
      <h1>{selectedStudent.name}</h1>
      <Flex style={{ alignItems: "center", gap: "7px" }}>
        <h2>Student Details</h2>
        {(selectedSchool.role === ROLES.PRIMARY ||
          selectedSchool.role === ROLES.ADMIN) && (
          <EditIcon onClick={editStudentModal} />
        )}
      </Flex>
      <List items={detailItems} />
    </>
  );
}
