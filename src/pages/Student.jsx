import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { Link } from "react-router-dom";
import { useSession } from '../context/SessionContext';
import IconButton from "../components/buttons/IconButton";
import icons from "../utils/icons.json";

export default function Student() {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [teams, setTeams] = useState([]);
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");

  const { userId } = useSession();

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

          const { data: roleData, error: roleError } = await supabase
            .from("users_schools")
            .select("role")
            .eq("school_id", studentData.school_id)
            .eq("user_id", userId)
            .single();

            if (roleError) {
              throw roleError;
            }

            if (roleData) {
              setRole(roleData.role);
            }

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

  const isAdmin = role === ("Primary") || role === ("Admin");
  const isPrimaryAdmin = role === ("Primary");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  document.title = `${student.name} - MockMetrics`;

  const handleEditStudentClick = () => {
    window.alert("Edit student");
  }

  const handleDeleteStudentClick = () => {
    window.alert("Delete student");
  }

  const handleEditTeamAssignmentClick = () => {
    window.alert("Edit team assignment");
  }

  const handleDeletePreviousTeamClick = () => {
    window.alert("Delete previous team assignment");
  }

  return (
    <div>
      <h1>{student.name}</h1>
      <div>
        {isAdmin && <IconButton text={"Edit Student"} handleClickFunction={handleEditStudentClick} icon="edit" />}
        {isPrimaryAdmin && <IconButton text={"Delete Student"} handleClickFunction={handleDeleteStudentClick} icon="delete" />}
      </div>
      <li>
        School:{" "}
        <Link to={`/schools/${school.id}`}>
          {" " + school.name}
          {school.short_name ? " (" + school.short_name + ")" : ""}
        </Link>
      </li>
      <li>
        Current Student: {student.is_active ? icons["check"] : icons["x"]}
      </li>
      <h2>Teams</h2>
      {isAdmin && <IconButton text={"Edit Team Assignment"} handleClickFunction={handleEditTeamAssignmentClick} icon="edit" />}
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
      {isPrimaryAdmin && <IconButton text={"Delete Previous Team Assignment"} icon="delete" handleClickFunction={handleDeletePreviousTeamClick} />}
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
