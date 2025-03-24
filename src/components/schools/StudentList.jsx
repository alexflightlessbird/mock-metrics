import React from "react";
import { Link } from "react-router-dom";
import List from "../common/List";

export default function StudentList({ students }) {
    const mappedStudents = [];
    students.map((s) => (
        mappedStudents.push(
            <Link to={`/students?id=${s.id}`}>{s.name}</Link>
        )
    ))
    if (mappedStudents.length == 0) mappedStudents.push("None");
    return <List items={mappedStudents} />
}