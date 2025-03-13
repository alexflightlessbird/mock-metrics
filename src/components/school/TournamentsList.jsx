import React from "react";
import { Link } from "react-router-dom";
import IconButton from "../buttons/IconButton";

export default function TournamentsList({ tournaments, isAdmin, schoolId }) {
  const handleAddTournamentClick = () => {
    window.alert("Add tournament - will be dialog");
  };

  return (
    <div>
      <h2>Tournaments</h2>
      {isAdmin && (
        <div>
          <IconButton
            icon="add"
            text="Add Tournament"
            handleClickFunction={handleAddTournamentClick}
          />
        </div>
      )}
      <h3>Active Tournaments</h3>
      <ul>
        {tournaments
          .filter((t) => t.is_active)
          .map((t) => (
            <li key={t.id}>
              <Link to={`/tournament/${t.id}`}>{t.name}</Link>
            </li>
          ))}
      </ul>
      <h3>Inactive Tournaments</h3>
      <ul>
        {tournaments
          .filter((t) => !t.is_active)
          .map((t) => (
            <li key={t.id}>
              <Link to={`/tournament/${t.id}`}>{t.name}</Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
