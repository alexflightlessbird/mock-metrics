import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { Link } from "react-router-dom";

export default function Team() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [school, setSchool] = useState(null);
  const [caseVal, setCaseVal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [students, setStudents] = useState([]);

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
            .select("students(*)")
            .eq("team_id", teamId);

          if (studentData && studentData.length > 0) {
            const studentList = studentData.map((s) => s.students);
            setStudents(studentList);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  document.title = `${team.name} - MockMetrics`;

  return (
    <div>
      <h1>{team.name}</h1>
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
          Current Team: {team.is_active ? <>&#128505;</> : <>&#128503;</>}
        </li>
        <li>
          Associated Case:{" "}
          <Link to={`/cases/${caseVal.id}`}>{caseVal.name}</Link>
        </li>
      </ul>
      <h2>Students</h2>
      <ul>
        {students.map((s) => (
          <li key={s.id}>
            <Link to={`/student/${s.id}`}>{s.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
