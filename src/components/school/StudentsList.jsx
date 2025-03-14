import React, { useState, useEffect } from "react";
import Dialog from "../dialogs/Dialog";
import { supabase } from "../../services/supabaseClient";
import ListComponent from "../common/ListComponent";
import OpenModalButton from "../common/OpenModalButton";

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

      if (error) throw error;

      if (data && data.length > 0) {
        const newStudent = data[0];

        if (team_id) {
          await supabase
            .from("student_teams")
            .insert([{ student_id: newStudent.id, team_id, is_active: true }]);
        }

        if (newStudent.is_active) {
          setActiveStudents((prev) => [...prev, newStudent]);
        } else {
          setInactiveStudents((prev) => [...prev, newStudent]);
        }
      }
    } catch (error) {
      console.error("Error adding student:", error);
      window.alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <h2>Students</h2>
      {isAdmin && (
        <>
          <OpenModalButton
            type="add"
            dialogClass="add-student-dialog"
            text="Add Student"
          />
          <Dialog
            className="add-student-dialog"
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
        </>
      )}
      <ListComponent
        items={activeStudents}
        title="Active Students"
        emptyMessage="No active students."
        linkPath="/student"
      />
      <ListComponent
        items={inactiveStudents}
        title="Inactive Students"
        emptyMessage="No inactive students"
        linkPath="/student"
      />
    </div>
  );
}
