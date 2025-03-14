import React, { useState, useEffect } from "react";
import AssigneesList from "../components/school/AssigneesList";
import TeamsList from "../components/school/TeamsList";
import StudentsList from "../components/school/StudentsList";
import TournamentsList from "../components/school/TournamentsList";
import SchoolHeader from "../components/school/SchoolHeader";
import SchoolDetails from "../components/school/SchoolDetails";
import { setDocumentTitle } from "../utils/helpers/documentTitle";
import LoadingErrorHandler from "../components/common/loaders/LoadingErrorHandler";
import { useSchool } from "../hooks/useSchool";
import { supabase } from "../services/supabaseClient";

export default function School() {
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
    role,
    roleLoading,
    roleError,
    assignees,
    assigneesLoading,
    assigneesError,
    cases,
    casesLoading,
    casesError,
    isAdmin,
    isPrimaryAdmin,
    handleTeamAdded,
  } = useSchool();

  useEffect(() => {
    if (school) {
        setShortName(school.short_name);
    }
  }, [school]);

  if (roleLoading) return <p>Loading...</p>;
  if (roleError) return <p>{roleError}</p>;

  if (schoolLoading) return <p>Loading school...</p>;
  if (schoolError) return <p>{schoolError}</p>;

  setDocumentTitle(`${shortName}`);

  const handleEditSchoolSubmit = (values) => {
    const newShortName = values["short-name"];
    if (newShortName === shortName) return;

    const { error } = supabase
      .from("schools")
      .update({ short_name: newShortName })
      .eq("id", school.id);

    if (error) {
        console.error("Error updating school:", error);
    } else {
        setShortName(newShortName);
    }
  }

  return (
    <div>
      <LoadingErrorHandler loading={schoolLoading} error={schoolError}>
        <SchoolHeader 
          school={school} 
          isPrimaryAdmin={isPrimaryAdmin} 
          shortName={shortName} 
          handleEditSchoolSubmit={handleEditSchoolSubmit} 
        />
        <SchoolDetails shortName={shortName} role={role} />
      </LoadingErrorHandler>

      {
        isPrimaryAdmin && 
        <AssigneesList 
          loading={assigneesLoading}
          error={assigneesError}
          assignees={assignees}
          schoolId={school.id}
        />
      } 

      <TeamsList teams={teams}
        loading={teamsLoading}
        error={teamsError}
        isAdmin={isAdmin}
        schoolId={school.id}
        onTeamAdded={handleTeamAdded}
      />

      <StudentsList
        loading={teamsLoading || studentsLoading}
        error={studentsError}
        students={students}
        isAdmin={isAdmin}
        schoolId={school.id}
        teams={teams}
      />

      <TournamentsList
        loading={tournamentsLoading || teamsLoading || casesLoading}
        error={tournamentsError}
        tournaments={tournaments}
        isPrimaryAdmin={isPrimaryAdmin}
        schoolId={school.id}
        cases={cases}
        teams={teams}
      />
    </div>
  );
}
