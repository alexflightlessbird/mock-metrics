import { useEffect, useState, useMemo } from "react";
import { supabase } from "../../services/supabaseClient";
import List from "../../common/components/List";
import { Link } from "react-router-dom";
import StudentList from "./StudentList";
import TournamentList from "./TournamentList";
import { Text } from "@mantine/core";

export default function SingleTeam({ selectedTeam }) {
  const [allStudents, setAllStudents] = useState([]);
  const [allTournaments, setAllTournaments] = useState([]);

  const [currentStudentAssignments, formerStudentAssignments] = useMemo(() => {
    const current = allStudents.filter((s) => s.is_active);
    const former = allStudents.filter((s) => !s.is_active);
    return [current, former];
  }, [allStudents]);

  const [activeTournaments, inactiveTournaments] = useMemo(() => {
    const active = allTournaments.filter((t) => t.tournaments.is_active);
    const inactive = allTournaments.filter((t) => !t.tournaments.is_active);
    return [active, inactive];
  }, [allTournaments]);

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

    const fetchTournaments = async () => {
      const { data, error } = await supabase
        .from("teams_tournaments")
        .select("*, tournaments(*)")
        .eq("team_id", selectedTeam.id)
        .order("tournaments(name)");
      if (error) console.error("Error fetching tournaments:", error);
      else setAllTournaments(data);
    };

    fetchStudents();
    fetchTournaments();
  }, [selectedTeam.id]);

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
      <h2>Attended Tournaments</h2>
      <h3>Active Tournaments</h3>
      <TournamentList tournaments={activeTournaments} />
      <h3>Inactive Tournaments</h3>
      <TournamentList tournaments={inactiveTournaments} />
    </>
  );
}
