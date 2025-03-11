import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { Link } from "react-router-dom";
import { useSession } from '../context/SessionContext';
import IconButton from "../components/buttons/IconButton";
import icons from "../utils/icons.json";

export default function Team() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [school, setSchool] = useState(null);
  const [caseVal, setCaseVal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentStudents, setCurrentStudents] = useState([]);
  const [previousStudents, setPreviousStudents] = useState([]);
  const [role, setRole] = useState("");

  const { userId } = useSession();

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data: teamData, error: teamError } = await supabase
          .from("teams")
          .select("*")
          .eq("id", teamId)
          .single();

        if (teamError) {
          throw teamError;
        }

        if (teamData) {
          setTeam(teamData);

          const { data: roleData, error: roleError } = await supabase
            .from("users_schools")
            .select("role")
            .eq("school_id", teamData.school_id)
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
            .eq("id", teamData.school_id)
            .single();

          if (schoolData) {
            setSchool(schoolData);
          }

          const { data: caseData } = await supabase
            .from("cases")
            .select("*")
            .eq("id", teamData.case_id)
            .single();

          if (caseData) {
            setCaseVal(caseData);
          }

            const { data: studentData } = await supabase
              .from("student_teams")
              .select("students(*), is_active")
              .eq("team_id", teamId);

              if (studentData && studentData.length > 0) {
                const current = studentData.filter((s) => s.is_active).map((s) => s.students);
                const previous = studentData.filter((s) => !s.is_active).map((s) => s.students);

                setCurrentStudents(current);
                setPreviousStudents(previous);
              }
        } else {
          setError("Team not found.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  const isAdmin = role === ("Primary") || role === ("Admin");
  const isPrimaryAdmin = role === ("Primary");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  document.title = `${team.name} - MockMetrics`;

  const handleEditTeamClick = () => {
    window.alert("Edit team");
  }

  const handleDeleteTeamClick = () => {
    window.alert("Delete team");
  }

  return (
    <div>
      <h1>{team.name}</h1>
      <div>
        {isAdmin && <IconButton icon="edit" text={"Edit Team"} handleClickFunction={handleEditTeamClick} />}
        {isPrimaryAdmin && <IconButton icon="delete" text={"Delete Team"} handleClickFunction={handleDeleteTeamClick}/>}
      </div>
      <ul>
        <li>
          School:{" "}
          <Link to={`/schools/${school.id}`}>
            {school.name}
            {school.short_name ? " (" + school.short_name + ")" : ""}
          </Link>
        </li>
        <li>Type: {team.type}</li>
        <li>
          Current Team: {team.is_active ? icons["check"] : icons["x"]}
        </li>
        <li>
          Associated Case:{" "}
          <Link to={`/cases/${caseVal.id}`}>{caseVal.name}</Link>
        </li>
      </ul>
      <h2>Students</h2>
      <h3>Current Students</h3>
      <ul>
        {currentStudents.map((s) => (
          <li key={s.id}>
            <Link to={`/student/${s.id}`}>{s.name}</Link>
          </li>
        ))}
      </ul>
      <h3>Previous Students</h3>
      <ul>
        {previousStudents.map((s) => (
          <li key={s.id}>
            <Link to={`/student/${s.id}`}>{s.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
