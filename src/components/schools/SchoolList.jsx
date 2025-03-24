import React from "react";
import { Link } from "react-router-dom";
import List from "../common/List";

export default function SchoolList({ schools }) {
    const mappedSchools = [];
    schools.map((s) => (
        mappedSchools.push(
            <Link to={`/schools?id=${s.schools.id}`}>{s.schools.name}</Link>
        )
    ))
    if (mappedSchools.length == 0) mappedSchools.push("None");
    return <List items={mappedSchools} />
}