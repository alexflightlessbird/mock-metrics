import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

export default function useSchoolData(schoolId, userId) {
  const [school, setSchool] = useState(null);
  const [teams, setTeams] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const [assignees, setAssignees] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const { data: schoolData, error: schoolError } = await supabase
          .from("schools")
          .select("*")
          .eq("id", schoolId)
          .single();

        if (schoolError) throw schoolError;

        if (schoolData) {
          setSchool(schoolData);

          const { data: roleData, error: roleError } = await supabase
            .from("users_schools")
            .select("role")
            .eq("school_id", schoolId)
            .eq("user_id", userId)
            .single();

          if (roleError) throw roleError;
          if (roleData) setRole(roleData.role);

          const { data: assigneesData, error: assigneesError } = await supabase
            .from("users_schools")
            .select("*, users(name, email)")
            .eq("school_id", schoolId);

          if (assigneesData) setAssignees(assigneesData);

          const { data: studentData } = await supabase
            .from("students")
            .select("*")
            .eq("school_id", schoolId)
            .order("name");

          if (studentData && studentData.length > 0) setStudents(studentData);

          const { data: teamData } = await supabase
            .from("teams")
            .select("*")
            .eq("school_id", schoolId)
            .order("name");

          if (teamData && teamData.length > 0) setTeams(teamData);

          const { data: tournamentData } = await supabase
            .from("tournaments")
            .select("*")
            .eq("school_id", schoolId)
            .order("year");

          if (tournamentData && tournamentData.length > 0)
            setTournaments(tournamentData);

          const { data: caseData } = await supabase
            .from("cases")
            .select("*")
            .order("year", { ascending: false });

          if (caseData && caseData.length > 0) setCases(caseData);
        } else {
          setError("School not found");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, [schoolId, userId]);

  return {
    school,
    teams,
    setTeams,
    students,
    loading,
    error,
    role,
    assignees,
    tournaments,
    cases,
  };
}
