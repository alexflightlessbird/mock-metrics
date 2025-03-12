import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import IconButton from "../components/buttons/IconButton";
import { useSession } from "../context/SessionContext";
import Dialog from "../components/dialogs/Dialog";
import AssigneesList from "../components/school/AssigneesList";
import TeamsList from "../components/school/TeamsList";
import StudentsList from "../components/school/StudentsList";
import TournamentsList from "../components/school/TournamentsList";
import useSchoolData from "../hooks/useSchoolData";

export default function School() {
  const { schoolId } = useParams();
  const { userId } = useSession();

  const {
    school,
    teams,
    students,
    loading,
    error,
    role,
    assignees,
    tournaments,
  } = useSchoolData(schoolId, userId);

  const isAdmin = role === "Primary" || role === "Admin";
  const isPrimaryAdmin = role === "Primary";

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  document.title = `${
    school.short_name ? school.short_name : school.name
  } - MockMetrics`;

  const handleEditSchoolClick = () => {
    const dialog = document.querySelector(".edit-school-dialog");
    dialog.showModal();
  };

  return (
    <div>
      <IconButton onClickLink="/schools" text="All Schools" icon="back" />
      <h1>{school.name}</h1>
      <div>
        {isPrimaryAdmin && (
          <>
            <IconButton
              icon="edit"
              handleClickFunction={handleEditSchoolClick}
              text="Edit School"
            />
            <br />
            <Dialog
              className="edit-school-dialog"
              legendText="Edit School"
              handleSubmit={(e) => {
                window.alert("Would be submitted here");
              }}
              questions={[
                {
                  type: "text",
                  id: "short-name",
                  label: "Short Name",
                  disabled: false,
                  required: true,
                  value: school.short_name,
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
        <li>Short Name: {school.short_name}</li>
        <li>
          Your Role: {role}
          {role === "Primary" ? " Admin" : ""}
        </li>
      </ul>
      {isPrimaryAdmin && <AssigneesList assignees={assignees} />}
      {<TeamsList teams={teams} isAdmin={isAdmin} />}
      {<StudentsList students={students} isAdmin={isAdmin} />}
      {<TournamentsList tournaments={tournaments} isAdmin={isAdmin} />}
    </div>
  );
}
