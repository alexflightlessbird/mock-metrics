import React from "react";
import { Link } from "react-router-dom";
import List from "../../common/components/List";

export default function StudentList({ students }) {
  const mappedStudents = [];
  students.map((s) =>
    mappedStudents.push(
      <Link to={`/students?id=${s.students.id}`}>
        {s.students.name}
        {s.students.is_active ? "" : " (Inactive Student)"}
      </Link>
    )
  );
  if (mappedStudents.length == 0) mappedStudents.push("None");
  return <List items={mappedStudents} />;
}
