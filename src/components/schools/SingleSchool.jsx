import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import List from "../common/List";
import { Flex, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { hasLength, useForm } from "@mantine/form";
import { EditIcon } from "../../components/common/ActionIcons";
import IconButton from "../../components/common/buttons/NewIconButton";
import SchoolTabs from "./SchoolTabs";

export default function SingleSchool({ selectedSchool, triggerReload }) {
  const [allTeams, setAllTeams] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [allTournaments, setAllTournaments] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [reload, setReload] = useState(false);

  const triggerReloadSingle = () => {
    setReload(!reload);
  }

  useEffect(() => {
    const fetchTeams = async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("school_id", selectedSchool.schools.id)
        .order("name");
      if (error) console.error("Error fetching teams:", error);
      else setAllTeams(data);
    }

    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("school_id", selectedSchool.schools.id)
        .order("name");
      if (error) console.error("Error fetching students:", error);
      else setAllStudents(data);
    }

    const fetchTournaments = async () => {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .eq("school_id", selectedSchool.schools.id)
        .order("year", { ascending: false });
      if (error) console.error("Error fetching tournaments:", error);
      else setAllTournaments(data);
    }

    const fetchUsers = async () => {
      if (selectedSchool.role === "Primary") {
        const { data, error } = await supabase
          .from("users_schools")
          .select("*, users(*)")
          .eq("school_id", selectedSchool.schools.id);
        if (error) console.error("Error fetching users:", error);
        else setAllUsers(data);
      }
    }

    fetchTeams();
    fetchStudents();
    fetchTournaments();
    fetchUsers();
  }, [selectedSchool.schools.id, selectedSchool.role, reload]);

  const detailItems = [
    `Short Name: ${selectedSchool.schools.short_name}`,
    selectedSchool.role === "Primary" ? `Premium Status: ${selectedSchool.schools.is_premium ? "Active" : "Inactive"}` : "",
    `Your Role: ${selectedSchool.role === "Primary" ? "Primary Admin" : selectedSchool.role}`
  ];

  const editSchoolForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      shortName: selectedSchool.schools.short_name || ""
    },
    validate: {
      shortName: hasLength({ min: 2, max: 10 }, "Short names must be 2-10 characters long")
    },
    validateInputOnBlur: true,
  });

  const handleEditSchoolSubmit = async (values, e) => {
    e.preventDefault();
    try {
      if (values.shortName === selectedSchool.schools.short_name) {
        modals.closeAll();
        return;
      }
      const { error } = await supabase
        .from("schools")
        .update({ short_name: values.shortName })
        .eq("id", selectedSchool.schools.id);
      if (error) throw error;
      modals.closeAll();
      triggerReload();
    } catch (error) {
      console.error("Error updating school:", error);
    }
  }

  const editSchoolModal = () => {
    modals.open({
      title: "Edit School Details",
      children: (
        <>
          <form onSubmit={editSchoolForm.onSubmit(handleEditSchoolSubmit)}>
            <TextInput
              label="Short Name"
              withAsterisk
              key={editSchoolForm.key("shortName")}
              placeholder="Enter the school's short name"
              {...editSchoolForm.getInputProps("shortName")}
            />
            <br />
            <IconButton icon="save" type="submit" buttonText="Submit" />
          </form>
        </>
      )
    })
  }

  return (
    <>
      <h1>{selectedSchool.schools.name}</h1>
      <Flex style={{ alignItems: "center", gap: "7px" }}>
        <h2>School Details</h2>
        {selectedSchool.role === "Primary" && (
          <EditIcon onClick={editSchoolModal} />
        )}
      </Flex>
      <List items={detailItems} />
      <br />

      <SchoolTabs 
        role={selectedSchool.role} 
        allUsers={allUsers} 
        allTeams={allTeams} 
        allStudents={allStudents} 
        allTournaments={allTournaments} 
        triggerReload={triggerReloadSingle} 
        isPremium={selectedSchool.schools.is_premium} 
        schoolId={selectedSchool.schools.id} 
        schoolName={selectedSchool.schools.name} 
      />
    </>
  )


}