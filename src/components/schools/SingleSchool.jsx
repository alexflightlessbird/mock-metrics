import React, { useEffect, useState, useMemo, lazy } from "react";
import { supabase } from "../../services/supabaseClient";
import List from "../common/List";
import TeamList from "./TeamList";
import StudentList from "./StudentList";
import TournamentList from "./TournamentList";
const UserList = lazy(() => import("./UserList"));
import { Flex, Tabs, Text, TextInput, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { hasLength, useForm } from "@mantine/form";
import { EditIcon } from "../../components/common/ActionIcons";
import IconButton from "../../components/common/buttons/NewIconButton";
import { ROLES, PREMIUM_LIMITS } from "../../utils/constants";

export default function SingleSchool({ selectedSchool, triggerReload }) {
  const [allTeams, setAllTeams] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [allTournaments, setAllTournaments] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [reload, setReload] = useState(false);

  const triggerReloadSingle = () => {
    setReload(!reload);
  }

  const [activeTeams, inactiveTeams] = useMemo(() => {
    const active = allTeams.filter((t) => t.is_active);
    const inactive = allTeams.filter((t) => !t.is_active);
    return [active, inactive];
  }, [allTeams]);

  const [activeStudents, inactiveStudents] = useMemo(() => {
    const active = allStudents.filter((s) => s.is_active);
    const inactive = allStudents.filter((s) => !s.is_active);
    return [active, inactive];
  }, [allStudents]);

  const [activeTournaments, inactiveTournaments] = useMemo(() => {
    const active = allTournaments.filter((t) => t.is_active);
    const inactive = allTournaments.filter((t) => !t.is_active);
    return [active, inactive];
  }, [allTournaments]);

  const [primaryAdminUsers, adminUsers, viewerUsers] = useMemo(() => {
    const primary = allUsers.filter((u) => u.role === ROLES.PRIMARY);
    const admin = allUsers.filter((u) => u.role === ROLES.ADMIN);
    const viewer = allUsers.filter((u) => u.role === ROLES.VIEWER);
    return [primary, admin, viewer];
  }, [allUsers]);

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

  const premiumTooltipLabel = "Upgrade to premium for unlimited spots";

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

      <Tabs defaultValue="teams">
        <Tabs.List>
          {selectedSchool.role === "Primary" && (<Tabs.Tab value="users">School Users</Tabs.Tab>)}
          <Tabs.Tab value="teams">Teams</Tabs.Tab>
          <Tabs.Tab value="students">Students</Tabs.Tab>
          <Tabs.Tab value="tournaments">Tournaments</Tabs.Tab>
        </Tabs.List>

        {selectedSchool.role === "Primary" && (<Tabs.Panel value="users">
          <>
            <br />
            <Text>To add additional users, please contact MSU Mock Trial.</Text>
            <h3>Primary Admins {selectedSchool.schools.is_premium ? "" : <Tooltip inline label={premiumTooltipLabel}><span>({primaryAdminUsers.length}/{PREMIUM_LIMITS.PRIMARY})</span></Tooltip>}</h3>
            <UserList users={primaryAdminUsers} triggerReload={triggerReloadSingle} isPremium={selectedSchool.schools.is_premium} schoolId={selectedSchool.school_id} />
            <h3>Admins {selectedSchool.schools.is_premium ? "" : <Tooltip inline label={premiumTooltipLabel}><span>({adminUsers.length}/{PREMIUM_LIMITS.ADMIN})</span></Tooltip>}</h3>
            <UserList users={adminUsers} triggerReload={triggerReloadSingle} schoolId={selectedSchool.school_id}  />
            <h3>Viewers {selectedSchool.schools.is_premium ? "" : <Tooltip inline label={premiumTooltipLabel}><span>({viewerUsers.length}/{PREMIUM_LIMITS.VIEWER})</span></Tooltip> }</h3>
            <UserList users={viewerUsers} triggerReload={triggerReloadSingle} schoolId={selectedSchool.school_id}  />
          </>
        </Tabs.Panel>)}

        <Tabs.Panel value="teams">
          <>
            <h3>Active Teams</h3>
            <TeamList teams={activeTeams} />
            <h3>Inactive Teams</h3>
            <TeamList teams={inactiveTeams} />
          </>
        </Tabs.Panel>

        <Tabs.Panel value="students">
          <>
            <h3>Active Students</h3>
            <StudentList students={activeStudents} />
            <h3>Inactive Students</h3>
            <StudentList students={inactiveStudents} />
          </>
        </Tabs.Panel>

        <Tabs.Panel value="tournaments">
          <>
            <h3>Active Tournaments</h3>
            <TournamentList tournaments={activeTournaments} />
            <h3>Inactive Tournaments</h3>
            <TournamentList tournaments={inactiveTournaments} />
          </>
        </Tabs.Panel>
      </Tabs>
    </>
  )


}