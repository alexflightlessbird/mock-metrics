import React, { useState, useEffect } from "react";
import Dialog from "../common/dialogs/Dialog";
import { supabase } from "../../services/supabaseClient";
import ListComponent from "../common/lists/ListComponent";
import OpenModalButton from "../common/buttons/OpenModalButton";

export default function TeamsList({ teams, isAdmin, schoolId, onTeamAdded }) {
  const [activeTeams, setActiveTeams] = useState([]);
  const [inactiveTeams, setInactiveTeams] = useState([]);

  useEffect(() => {
    setActiveTeams(teams.filter((t) => t.is_active));
    setInactiveTeams(teams.filter((t) => !t.is_active));
  }, [teams]);

  const handleAddTeamSubmit = async (values) => {
    const { name, type } = values;

    try {
      const { data, error } = await supabase
        .from("teams")
        .insert([{ name, school_id: schoolId, is_active: true, type }])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        const newTeam = data[0];
        onTeamAdded(newTeam);
      }
    } catch (error) {
      console.error("Error adding team:", error);
      window.alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <h2>Teams</h2>
      {isAdmin && (
        <>
          <OpenModalButton
            type="add"
            dialogClass="add-team-dialog"
            text="Add Team"
          />
          <Dialog
            className="add-team-dialog"
            legendText="Add Team"
            handleSubmit={handleAddTeamSubmit}
            questions={[
              {
                id: "name",
                label: "Name",
                type: "text",
                required: true,
                autofocus: true,
              },
              {
                type: "radio",
                label: "Type",
                id: "type",
                options: [
                  { label: "Pre-Stack", value: "Pre-Stack" },
                  { label: "Post-Stack", value: "Post-Stack" },
                ],
                required: true,
              },
            ]}
          />
        </>
      )}
      <ListComponent
        items={activeTeams}
        title="Active Teams"
        emptyMessage="No active teams."
        linkPath="/team"
      />
      <ListComponent
        items={inactiveTeams}
        title="Inactive Teams"
        emptyMessage="No inactive teams"
        linkPath="/team"
      />
    </div>
  );
}
