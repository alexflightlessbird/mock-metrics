import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import IconButton from "../buttons/IconButton";
import Dialog from "../dialogs/Dialog";
import { supabase } from "../../services/supabaseClient";

export default function TeamsList({ teams, isAdmin, schoolId }) {
  const [activeTeams, setActiveTeams] = useState([]);
  const [inactiveTeams, setInactiveTeams] = useState([]);

  useEffect(() => {
    setActiveTeams(teams.filter((t) => t.is_active));
    setInactiveTeams(teams.filter((t) => !t.is_active));
  }, [teams]);

  const handleAddTeamSubmit = async (values) => {
    const { name, school_id, is_active, type } = values;

    try {
      const { data, error } = await supabase
        .from("teams")
        .insert([{ name, school_id, is_active, type }])
        .select();

      if (error) {
        console.error("Error adding team:", error);
        return;
      }

      if (data && data.length > 0) {
        const newTeam = data[0];
        if (newTeam.is_active) {
          setActiveTeams((prev) => [...prev, newTeam]);
        } else {
          setInactiveTeams((prev) => [...prev, newTeam]);
        }
      }
    } catch (error) {
      console.error("Error adding team:", error);
    }
  };

  return (
    <div>
      <h2>Teams</h2>
      {isAdmin && (
        <>
          <IconButton
            icon="add"
            text="Add Team"
            handleClickFunction={() =>
              document.querySelector(".add-team-dialog").showModal()
            }
          />
          <br />
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
                type: "hidden",
                id: "school_id",
                value: schoolId,
              },
              {
                type: "radio",
                label: "Active",
                id: "is_active",
                options: [
                  { label: "Yes", value: true },
                  { label: "No", value: false },
                ],
                required: false,
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
      <h3>Active Teams</h3>
      <ul>
        {activeTeams.length > 0 ? (
          activeTeams.map((t) => (
            <li key={t.id}>
              <Link to={`/team/${t.id}`}>{t.name}</Link>
            </li>
          ))
        ) : (
          <li>No active teams</li>
        )}
      </ul>
      <h3>Inactive Teams</h3>
      <ul>
        {inactiveTeams.length > 0 ? (
          inactiveTeams.map((t) => (
            <li key={t.id}>
              <Link to={`/team/${t.id}`}>{t.name}</Link>
            </li>
          ))
        ) : (
          <li>No inactive teams</li>
        )}
      </ul>
    </div>
  );
}
