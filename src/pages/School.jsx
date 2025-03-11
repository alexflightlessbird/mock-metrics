import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import BackButton from "../components/buttons/BackButton";
import { Link } from "react-router-dom";

export default function School() {
  const { schoolId } = useParams();
  const [school, setSchool] = useState(null);
  const [teams, setTeams] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const { data: schoolData, error: schoolError } = await supabase
          .from("schools")
          .select("*")
          .eq("id", schoolId)
          .single();

        if (schoolError) {
          throw schoolError;
        }

        if (schoolData) {
          setSchool(schoolData);

          const { data: studentData } = await supabase
            .from("students")
            .select("*")
            .eq("school_id", schoolId)
            .eq("is_active", true)
            .order("name");

          if (studentData && studentData.length > 0) {
            setStudents(studentData);
          }

          const { data: teamData } = await supabase
            .from("teams")
            .select("*")
            .eq("school_id", schoolId)
            .eq("is_active", true)
            .order("name");

          if (teamData && teamData.length > 0) {
            setTeams(teamData);
          }
        } else {
          setError("School not found.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  document.title = `${
    school.short_name ? school.short_name : school.name
  } - MockMetrics`;

  return (
    <div>
      <BackButton onClickLink="/schools" />
      <h1>{school.name}</h1>
      <ul>
        <li>Short Name: {school.short_name}</li>
      </ul>
      <h2>Current Teams</h2>
      <ul>
        {teams.map((t) => (
          <li key={t.id}>
            <Link to={`/team/${t.id}`}>{t.name}</Link>
          </li>
        ))}
      </ul>
      <h2>Current Students</h2>
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
