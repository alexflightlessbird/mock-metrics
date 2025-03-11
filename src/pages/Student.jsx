import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { Link } from "react-router-dom";

export default function Student() {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [teams, setTeams] = useState([]);
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const { data: studentData, error: studentError } = await supabase
          .from("students")
          .select("*")
          .eq("id", studentId)
          .single();

        if (studentError) {
          throw studentError;
        }

        if (studentData) {
          setStudent(studentData);

          const { data: schoolData } = await supabase
            .from("schools")
            .select("*")
            .eq("id", studentData.school_id)
            .single();

          if (schoolData) {
            setSchool(schoolData);
          }

          const { data: teamData } = await supabase
            .from("student_teams")
            .select("teams(*), is_active")
            .eq("student_id", studentId);

          if (teamData && teamData.length > 0) {
            const teamList = teamData.map((t) => t.teams);
            setTeams(teamList);

            const activeTeam = teamData.find((t) => t.is_active)?.teams;
            setCurrentTeam(activeTeam || null);
          }
        } else {
          setError("Student not found.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  document.title = `${student.name} - MockMetrics`;

  return (
    <div>
      <h1>{student.name}</h1>
      <li>
        School:{" "}
        <Link to={`/schools/${school.id}`}>
          {" " + school.name}
          {school.short_name ? " (" + school.short_name + ")" : ""}
        </Link>
      </li>
      <li>
        Current Student: {student.is_active ? <>&#128505;</> : <>&#128503;</>}
      </li>
      <h2>Teams</h2>
      <h3>Current Team</h3>
      <ul>
        {currentTeam ? (
          <li>
            <Link to={`/team/${currentTeam.id}`}>{currentTeam.name}</Link>
          </li>
        ) : (
          <li>No team currently assigned.</li>
        )}
      </ul>
      <h3>Previous Teams</h3>
      <ul>
        {currentTeam
          ? teams
              .filter((t) => t.id !== currentTeam.id)
              .map((t) => (
                <li key={t.id}>
                  <Link to={`/team/${t.id}`}>{t.name}</Link>
                </li>
              ))
          : teams.map((t) => (
              <li key={t.id}>
                <Link to={`/team/${t.id}`}>{t.name}</Link>
              </li>
            ))}
      </ul>
    </div>
  );
}
