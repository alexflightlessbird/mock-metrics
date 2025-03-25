import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../../services/supabaseClient";
import List from "../common/List";
import { Link } from "react-router-dom";
import StudentList from "./StudentList";
import { Text } from "@mantine/core";

export default function SingleTeam({ selectedTeam }) {
  const [allStudents, setAllStudents] = useState([]);

  const [activeStudents, inactiveStudents] = useMemo(() => {
    const active = allStudents.filter((s) => s.is_active);
    const inactive = allStudents.filter((s) => !s.is_active);
    return [active, inactive];
  }, [allStudents]);

  const [currentStudentAssignments, formerStudentAssignments] = useMemo(() => {
    const current = allStudents.filter((s) => s.is_active);
    const former = allStudents.filter((s) => !s.is_active);
    return [current, former];
  }, [allStudents]);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from("students_teams")
        .select("*, students(*)")
        .eq("team_id", selectedTeam.id)
        .order("students(name)");
      if (error) console.error("Error fetching students:", error);
      else setAllStudents(data);
    };
    fetchStudents();
  }, []);

  const schoolItem = (
    <Link to={`/schools?id=${selectedTeam?.schools.id}`}>
      {selectedTeam?.schools.name}
    </Link>
  );

  const detailItems = [
    <Text>School: {schoolItem}</Text>,
    `Status: ${selectedTeam.is_active ? "Active" : "Inactive"}`,
    `Type: ${selectedTeam.type}`,
  ];

  return (
    <>
      <h1>{selectedTeam.name}</h1>
      <h2>Team Details</h2>
      <List items={detailItems} />
      <h2>Associated Students</h2>
      <h3>Currently Assigned</h3>
      <StudentList students={currentStudentAssignments} />
      <h3>Formerly Assigned</h3>
      <StudentList students={formerStudentAssignments} />
    </>
  );
}
