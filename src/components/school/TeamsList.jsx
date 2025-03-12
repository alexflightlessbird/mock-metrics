import React from "react";
import { Link } from "react-router-dom";
import IconButton from "../buttons/IconButton";

export default function TeamsList({ teams, isAdmin }) {
  const handleAddTeamClick = () => {
    window.alert("Add team - will be dialog");
  };

  return (
    <div>
      <h2>Teams</h2>
      {isAdmin && (
        <div>
          <IconButton
            icon="add"
            text="Add Team"
            handleClickFunction={handleAddTeamClick}
          />
        </div>
      )}
      <h3>Active Teams</h3>
      <ul>
        {teams
          .filter((t) => t.is_active)
          .map((t) => (
            <li key={t.id}>
              <Link to={`/team/${t.id}`}>{t.name}</Link>
            </li>
          ))}
      </ul>
      <h3>Inactive Teams</h3>
      <ul>
        {teams
          .filter((t) => !t.is_active)
          .map((t) => (
            <li key={t.id}>
              <Link to={`/team/${t.id}`}>{t.name}</Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
