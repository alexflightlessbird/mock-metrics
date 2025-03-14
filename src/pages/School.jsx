import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useSession } from "../hooks/auth/useSession";
import AssigneesList from "../components/school/AssigneesList";
import TeamsList from "../components/school/TeamsList";
import StudentsList from "../components/school/StudentsList";
import TournamentsList from "../components/school/TournamentsList";
import useFetchData from "../hooks/useFetchData";
import useSchoolData from "../hooks/useSchoolData";
import { fetchCases } from "../services/api/caseApi";
import SchoolHeader from "../components/school/SchoolHeader";
import SchoolDetails from "../components/school/SchoolDetails";

export default function School() {
  const { schoolId } = useParams();
  const { userId } = useSession();
  const [shortName, setShortName] = useState("");

  const { 
    school,
    schoolLoading,
    schoolError,
    teams,
    teamsLoading,
    teamsError,
    tournaments,
    tournamentsLoading,
    tournamentsError,
    students,
    studentsLoading,
    studentsError,
    roleData,
    roleLoading,
    roleError,
    assignees,
    assigneesLoading,
    assigneesError 
  } = useSchoolData(schoolId, userId);
  const { data: cases, loading: casesLoading, error: casesError } = useFetchData(() => fetchCases(), false, []);

  useEffect(() => {
    if (school) {
      setShortName(school.short_name);
    }
  }, [school]);

  if (roleLoading) return <p>Loading...</p>;
  if (roleError) return <p>{roleError}</p>;
  
  const role = roleData.role;

  const isAdmin = role === "Primary" || role === "Admin";
  const isPrimaryAdmin = role === "Primary";

  if (schoolLoading) return <p>Loading school...</p>;
  if (schoolError) return <p>{schoolError}</p>;

  const handleTeamAdded = (newTeam) => {
    setTeams((prevTeams) => [...prevTeams, newTeam]);
  };

  document.title = `${shortName} - MockMetrics`;

  const handleEditSchoolSubmit = (values) => {
    const newShortName = values["short-name"];
    if (newShortName === shortName) return;

    const { error } = supabase
      .from("schools")
      .update({ short_name: newShortName })
      .eq("id", schoolId);

    if (error) {
      console.error("Error updating school:", error);
    } else {
      setShortName(newShortName);
    }
  };

  return (
    <div>
      <SchoolHeader school={school} isPrimaryAdmin={isPrimaryAdmin} shortName={shortName} handleEditSchoolSubmit={handleEditSchoolSubmit} />
      <SchoolDetails shortName={shortName} role={role} />
      {isPrimaryAdmin && assigneesLoading && <p>Loading assignees...</p>}
      {isPrimaryAdmin && !assigneesLoading && (
        <AssigneesList assignees={assignees} schoolId={schoolId} />
      )}

      {teamsLoading ? 
        <p>Loading teams...</p> : 
        <TeamsList teams={teams}
          isAdmin={isAdmin}
          schoolId={schoolId}
          onTeamAdded={handleTeamAdded}
        />
      }

      {teamsLoading || studentsLoading ? 
        <p>Loading students...</p> : 
        <StudentsList
          students={students}
          isAdmin={isAdmin}
          schoolId={schoolId}
          teams={teams}
        />
      }
      {tournamentsLoading || teamsLoading || casesLoading ? 
        <p>Loading tournaments...</p> :
        <TournamentsList
          tournaments={tournaments}
          isPrimaryAdmin={isPrimaryAdmin}
          isAdmin={isAdmin}
          schoolId={schoolId}
          cases={cases}
          teams={teams}
        />
      }
    </div>
  );
}
