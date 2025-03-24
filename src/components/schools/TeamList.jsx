import React from "react";
import { Link } from "react-router-dom";
import List from "../common/List";

export default function TeamList({ teams }) {
    const mappedTeams = [];
    teams.map((t) => (
        mappedTeams.push(
            <Link to={`/teams?id=${t.id}`}>{t.name}</Link>
        )
    ))
    if (mappedTeams.length == 0) mappedTeams.push("None");
    return <List items={mappedTeams} />
}