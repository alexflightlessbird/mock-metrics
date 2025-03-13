import React from "react";
import { Link } from "react-router-dom";
import IconButton from "../buttons/IconButton";

export default function StudentsList({ students, isAdmin, schoolId }) {
  const handleAddStudentClick = () => {
    window.alert("Add student - will be dialog");
  };

  return (
    <div>
      <h2>Students</h2>
      {isAdmin && (
        <div>
          <IconButton
            icon="add"
            text="Add Student"
            handleClickFunction={handleAddStudentClick}
          />
        </div>
      )}
      <h3>Current Students</h3>
      <ul>
        {students
          .filter((s) => s.is_active)
          .map((s) => (
            <li key={s.id}>
              <Link to={`/student/${s.id}`}>{s.name}</Link>
            </li>
          ))}
      </ul>
      <h3>Inactive Students</h3>
      <ul>
        {students
          .filter((s) => !s.is_active)
          .map((s) => (
            <li key={s.id}>
              <Link to={`/student/${s.id}`}>{s.name}</Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
