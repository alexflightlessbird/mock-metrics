import React from "react";
import { Link } from "react-router-dom";
import List from "../common/List";

export default function TeamList({ teams }) {
  const teamsBySchool = teams.reduce((acc, team) => {
    const schoolId = team.schools?.id || "unknown";
    if (!acc[schoolId]) {
      acc[schoolId] = {
        schoolName: team.schools?.name || "Unknown School",
        shortName: team.schools?.short_name || "UNK",
        teams: [],
      };
    }
    acc[schoolId].teams.push(team);
    return acc;
  }, {});

  const schoolGroups = Object.values(teamsBySchool).sort((a, b) =>
    a.schoolName.localeCompare(b.schoolName)
  );

  if (schoolGroups.length === 0) {
    return <List items={["None"]} />;
  }

  return (
    <>
      {schoolGroups.map((school) => (
        <div
          key={`${school.schoolName}-${school.shortName}`}
          style={{ marginBottom: "1rem" }}
        >
          <h4>
            {school.schoolName} ({school.shortName})
          </h4>
          <List
            items={school.teams.map((team) => (
              <Link to={`/teams?id=${team.id}`}>{team.name}</Link>
            ))}
          />
        </div>
      ))}
    </>
  );
}
