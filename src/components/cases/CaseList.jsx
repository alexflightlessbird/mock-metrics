import React from "react";
import { Link } from "react-router-dom";
import List from "../common/List";

export default function CaseList({ cases }) {
    const mappedCases = [];
    cases.map((c) => (
        mappedCases.push(
            <Link to={`/cases?id=${c.id}`}>{c.name}</Link>
        )
    ));
    if (mappedCases.length == 0) mappedCases.push("None");
    return <List items={mappedCases} />
}