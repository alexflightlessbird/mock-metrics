import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import SchoolBreadcrumb from "./SchoolBreadcrumb";
import SingleTeam from "./SingleTeam";
import SingleStudent from "./SingleStudent";
import SingleTournament from "./SingleTournament";
import { useSearchParams } from "react-router-dom";
import SingleSchoolDetails from "./SingleSchoolDetails";
import { ROLES } from "../../utils/constants";

export default function SingleSchool({ selectedSchool, triggerReload }) {
  const [allTeams, setAllTeams] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [allStudentTeams, setAllStudentTeams] = useState([]);
  const [allTournaments, setAllTournaments] = useState([]);
  const [allTeamsTournaments, setAllTeamsTournaments] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [reload, setReload] = useState(false);
  const [searchParams] = useSearchParams();
  const [currentTab, setCurrentTab] = useState("teams");

  const teamId = searchParams.get("teamId");
  const studentId = searchParams.get("studentId");
  const tournamentId = searchParams.get("tournamentId");

  const triggerReloadSingle = () => {
    setReload(!reload);
  };

  useEffect(() => {
    const fetchTeams = async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("school_id", selectedSchool.schools.id)
        .order("name");
      if (error) console.error("Error fetching teams:", error);
      else setAllTeams(data);
    };

    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("school_id", selectedSchool.schools.id)
        .order("name");
      if (error) console.error("Error fetching students:", error);
      else setAllStudents(data);
    };

    const fetchTournaments = async () => {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .eq("school_id", selectedSchool.schools.id)
        .order("year", { ascending: false });
      if (error) console.error("Error fetching tournaments:", error);
      else setAllTournaments(data);
    };

    const fetchUsers = async () => {
      if (selectedSchool.role === ROLES.PRIMARY) {
        const { data, error } = await supabase
          .from("users_schools")
          .select("*, users(*)")
          .eq("school_id", selectedSchool.schools.id);
        if (error) console.error("Error fetching users:", error);
        else setAllUsers(data);
      }
    };

    const fetchStudentTeams = async () => {
      const { data, error } = await supabase
        .from("students_teams")
        .select("*, students(*), teams(*)")
        .eq("students.school_id", selectedSchool.schools.id);
      if (error) console.error("Error fetching student teams:", error);
      else setAllStudentTeams(data);
    };

    const fetchTeamsTournaments = async () => {
      const { data, error } = await supabase
        .from("teams_tournaments")
        .select("*, teams(*), tournaments(*)")
        .eq("teams.school_id", selectedSchool.schools.id);
      if (error) console.error("Error fetching teams tournaments:", error);
      else setAllTeamsTournaments(data);
    };

    fetchTeams();
    fetchStudents();
    fetchStudentTeams();
    fetchTournaments();
    fetchTeamsTournaments();
    fetchUsers();
  }, [selectedSchool.schools.id, selectedSchool.role, reload]);

  const renderContent = () => {
    if (teamId) {
      const team = allTeams.find((t) => t.id === parseInt(teamId));
      if (!team)
        return (
          <SingleTeam
            selectedSchool={selectedSchool}
            selectedTeam="Not found"
          />
        );
      return (
        <SingleTeam
          selectedSchool={selectedSchool}
          selectedTeam={team}
          allStudentTeams={allStudentTeams}
          allTeamsTournaments={allTeamsTournaments}
          triggerReload={triggerReloadSingle}
        />
      );
    }

    if (studentId) {
      const student = allStudents.find((s) => s.id === parseInt(studentId));
      if (!student)
        return (
          <SingleStudent
            selectedSchool={selectedSchool}
            selectedStudent="Not found"
          />
        );
      return (
        <SingleStudent
          selectedSchool={selectedSchool}
          selectedStudent={student}
          allTeams={allTeams}
          allStudentTeams={allStudentTeams}
          triggerReload={triggerReloadSingle}
        />
      );
    }

    if (tournamentId) {
      const tournament = allTournaments.find(
        (t) => t.id === parseInt(tournamentId)
      );
      if (!tournament)
        return (
          <SingleTournament
            selectedSchool={selectedSchool}
            selectedTournament="Not found"
          />
        );
      return (
        <SingleTournament
          selectedSchool={selectedSchool}
          selectedTournament={tournament}
          allTeams={allTeams}
          allTeamsTournaments={allTeamsTournaments}
          triggerReload={triggerReloadSingle}
        />
      );
    }

    return (
      <SingleSchoolDetails
        selectedSchool={selectedSchool}
        allUsers={allUsers}
        allStudents={allStudents}
        allTeams={allTeams}
        allTournaments={allTournaments}
        triggerReload={triggerReload}
        triggerReloadSingle={triggerReloadSingle}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
    );
  };

  return (
    <>
      <SchoolBreadcrumb
        selectedSchool={selectedSchool}
        allStudents={allStudents}
        allTeams={allTeams}
        allTournaments={allTournaments}
      />
      {renderContent()}
    </>
  );
}
