import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import IconButton from "../components/buttons/IconButton";
import OpenModalButton from "../components/common/OpenModalButton";
import { useSession } from "../context/SessionContext";
import Dialog from "../components/dialogs/Dialog";
import useSchoolData from "../hooks/useSchoolData";
import AssigneesList from "../components/school/AssigneesList";
import TeamsList from "../components/school/TeamsList";
import StudentsList from "../components/school/StudentsList";
import TournamentsList from "../components/school/TournamentsList";

export default function School() {
  const { schoolId } = useParams();
  const { userId } = useSession();
  const [shortName, setShortName] = useState("");

  const {
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
  } = useSchoolData(schoolId, userId);

  const isAdmin = role === "Primary" || role === "Admin";
  const isPrimaryAdmin = role === "Primary";

  useEffect(() => {
    if (school) {
      setShortName(school.short_name);
    }
  }, [school]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

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
      <IconButton onClickLink="/schools" text="All Schools" icon="back" />
      <h1>{school.name}</h1>
      <div>
        {isPrimaryAdmin && (
          <>
            <OpenModalButton
              type="edit"
              text="Edit School"
              dialogClass="edit-school-dialog"
            />
            <Dialog
              className="edit-school-dialog"
              legendText="Edit School"
              handleSubmit={handleEditSchoolSubmit}
              questions={[
                {
                  type: "text",
                  id: "short-name",
                  label: "Short Name",
                  value: shortName,
                  required: true,
                },
              ]}
            />
          </>
        )}
        <IconButton
          icon="forward"
          onClickLink={`/schools/${schoolId}/analysis`}
          text="Ballot Analysis"
        />
      </div>
      <ul>
        <li>Short Name: {shortName}</li>
        <li>
          Your Role: {role}
          {role === "Primary" ? " Admin" : ""}
        </li>
      </ul>
      {isPrimaryAdmin && (
        <AssigneesList assignees={assignees} schoolId={schoolId} />
      )}

      <TeamsList
        teams={teams}
        isAdmin={isAdmin}
        schoolId={schoolId}
        onTeamAdded={handleTeamAdded}
      />
      <StudentsList
        students={students}
        isAdmin={isAdmin}
        schoolId={schoolId}
        teams={teams}
      />
      <TournamentsList
        tournaments={tournaments}
        isPrimaryAdmin={isPrimaryAdmin}
        isAdmin={isAdmin}
        schoolId={schoolId}
        cases={cases}
        teams={teams}
      />
    </div>
  );
}
