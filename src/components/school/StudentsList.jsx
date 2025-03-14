import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import IconButton from "../buttons/IconButton";
import Dialog from "../dialogs/Dialog";
import { supabase } from "../../services/supabaseClient";

export default function StudentsList({ students, isAdmin, schoolId, teams }) {
  const [activeStudents, setActiveStudents] = useState([]);
  const [inactiveStudents, setInactiveStudents] = useState([]);

  useEffect(() => {
    setActiveStudents(students.filter((s) => s.is_active));
    setInactiveStudents(students.filter((s) => !s.is_active));
  }, [students]);

  const handleAddStudentSubmit = async (values) => {
    const { name, is_active, team_id } = values;

    try {
      const { data, error } = await supabase
        .from("students")
        .insert([{ name, school_id: schoolId, is_active }])
        .select();

      if (error) {
        console.error("Error adding student:", error);
        window.alert(
          "Something went wrong with adding this student. Please try again."
        );
        return;
      }

      console.log("Data: ", data.length);
      console.log("Team id: ", team_id);

      if (data && data.length > 0) {
        const newStudent = data[0];

        console.log(team_id);

        if (team_id) {
          const { error: teamError } = await supabase
            .from("student_teams")
            .insert([{ student_id: newStudent.id, team_id, is_active: true }]);

          if (teamError) {
            console.error("Error assigning student to team:", teamError);
            window.alert(
              "Student was added, but there was an error assigning them to the team."
            );
          }
        }

        if (newStudent.is_active) {
          setActiveStudents((prev) => [...prev, newStudent]);
        } else {
          setInactiveStudents((prev) => [...prev, newStudent]);
        }
      }
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  return (
    <div>
      <h2>Students</h2>
      {isAdmin && (
        <div>
          <IconButton
            icon="add"
            text="Add Student"
            handleClickFunction={() =>
              document.querySelector(".add-student-dialog").showModal()
            }
          />
          <br />
          <Dialog
            className={"add-student-dialog"}
            legendText="Add Student"
            handleSubmit={handleAddStudentSubmit}
            questions={[
              {
                id: "name",
                label: "Name",
                type: "text",
                required: true,
                autofocus: true,
              },
              {
                type: "radio",
                label: "Active",
                id: "is_active",
                options: [
                  { label: "Yes", value: true },
                  { label: "No", value: false },
                ],
                required: true,
              },
              {
                type: "select",
                label: "Assign to Team",
                id: "team_id",
                optionsGrouped: [
                  {
                    options: [
                      { label: "No Team", value: "" },
                      ...teams
                        .filter((t) => t.is_active)
                        .map((t) => ({ label: t.name, value: t.id })),
                    ],
                  },
                ],
                required: true,
              },
            ]}
          />
        </div>
      )}
      <h3>Current Students</h3>
      <ul>
        {activeStudents.length > 0 ? (
          activeStudents.map((s) => (
            <li key={s.id}>
              <Link to={`/student/${s.id}`}>{s.name}</Link>
            </li>
          ))
        ) : (
          <li>No active students</li>
        )}
      </ul>
      <h3>Inactive Students</h3>
      <ul>
        {inactiveStudents.length > 0 ? (
          inactiveStudents.map((s) => (
            <li key={s.id}>
              <Link to={`/student/${s.id}`}>{s.name}</Link>
            </li>
          ))
        ) : (
          <li>No inactive students</li>
        )}
      </ul>
    </div>
  );
}
