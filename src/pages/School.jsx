import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import IconButton from "../components/buttons/IconButton";
import { Link } from "react-router-dom";
import { useSession } from '../context/SessionContext';

export default function School() {
  const { schoolId } = useParams();
  const [school, setSchool] = useState(null);
  const [teams, setTeams] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const [assignees, setAssignees] = useState([]);

  const { userId } = useSession();

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const { data: schoolData, error: schoolError } = await supabase
          .from("schools")
          .select("*")
          .eq("id", schoolId)
          .single();

        if (schoolError) {
          throw schoolError;
        }

        if (schoolData) {
          setSchool(schoolData);

          const { data: roleData, error: roleError } = await supabase
            .from("users_schools")
            .select("role")
            .eq("school_id", schoolId)
            .eq("user_id", userId)
            .single();
          
          if (roleError) {
            throw roleError;
          }

          if (roleData) {
            setRole(roleData.role);
          }

          const { data: assigneesData, error: assigneesError } = await supabase
            .from("users_schools")
            .select("*, users(name, email)")
            .eq("school_id", schoolId);

            if (assigneesData) {
              setAssignees(assigneesData);
            }

          const { data: studentData } = await supabase
            .from("students")
            .select("*")
            .eq("school_id", schoolId)
            .order("name");

          if (studentData && studentData.length > 0) {
            setStudents(studentData);
          }

          const { data: teamData } = await supabase
            .from("teams")
            .select("*")
            .eq("school_id", schoolId)
            .order("name");

          if (teamData && teamData.length > 0) {
            setTeams(teamData);
          }
        } else {
          setError("School not found.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, []);

  const isAdmin = role === ("Primary") || role === ("Admin");
  const isPrimaryAdmin = role === ("Primary");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  document.title = `${
    school.short_name ? school.short_name : school.name
  } - MockMetrics`;

  const handleEditSchoolClick = () => {
    window.alert("Editing School");
  }

  const handleEditUserRolesClick = () => {
    window.alert("Editing user roles");
  }

  const handleAddUserClick = () => {
    window.alert("Add user");
  }

  const handleRemoveUserClick = () => {
    window.alert("Remove user");
  }

  const handleAddTeamClick = () => {
    window.alert("Add team");
  }

  const handleDeleteTeamClick = () => {
    window.alert("Delete team");
  }

  const handleAddStudentClick = () => {
    window.alert("Add student");
  }

  const handleDeleteStudentClick = () => {
    window.alert("Delete student");
  }
  

  return (
    <div>
      <IconButton onClickLink="/schools" text="All Schools" icon="back" />
      <h1>{school.name}</h1>
      {isPrimaryAdmin && <div><IconButton icon="edit" handleClickFunction={handleEditSchoolClick} text="Edit School" /></div>}
      <ul>
        <li>Short Name: {school.short_name}</li>
        <li>Your Role: {role}{role === "Primary" ? " Admin" : ""}</li>
      </ul>
      {isPrimaryAdmin && (
        <div>
          <h2>School Users</h2>
          <div>
            <IconButton icon="add" text="Add User" handleClickFunction={handleAddUserClick} />
            <IconButton icon="edit" text={"Edit User Roles"} handleClickFunction={handleEditUserRolesClick} />
            <IconButton icon="delete" text={"Remove User"} handleClickFunction={handleRemoveUserClick} />
          </div>
          <h3>Primary Admins</h3>
          <ul>
            {assignees.filter((a) => a.role === "Primary").map((a, index) => (
              <li key={index}>
                <p>Name: {a.users.name}</p>
                <p>Email: {a.users.email}</p>
              </li>
            ))}
          </ul>
          <h3>Standard Admins</h3>
          <ul>
            {assignees.filter((a) => a.role === "Admin").map((a, index) => (
              <li key={index}>
                <p>Name: {a.users.name}</p>
                <p>Email: {a.users.email}</p>
              </li>
            ))}
          </ul>
          <h3>Viewers</h3>
          <ul>
            {assignees.filter((a) => a.role === "Viewer").map((a, index) => (
              <li key={index}>
                <p>Name: {a.users.name}</p>
                <p>Email: {a.users.email}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      <h2>Teams</h2>
      <div>
        {isAdmin && <IconButton icon="add" text={"Add Team"} handleClickFunction={handleAddTeamClick} />}
        {isPrimaryAdmin && <IconButton icon="delete" text={"Delete Team"} handleClickFunction={handleDeleteTeamClick} />}
      </div>
      <h3>Current Teams</h3>
      <ul>
        {teams.filter((t) => t.is_active).map((t) => (
          <li key={t.id}>
            <Link to={`/team/${t.id}`}>{t.name}</Link>
          </li>
        ))}
      </ul>
      <h3>Inactive Teams</h3>
      <ul>
        {teams.filter((t) => !t.is_active).map((t) => (
          <li key={t.id}>
            <Link to={`/team/${t.id}`}>{t.name}</Link>
          </li>
        ))}
      </ul>
      <h2>Students</h2>
      <h3>Current Students</h3>
      <div>
        {isAdmin && <IconButton icon="add" text={"Add Student"} handleClickFunction={handleAddStudentClick} />}
        {isPrimaryAdmin && <IconButton icon="delete" text={"Delete Student"} handleClickFunction={handleDeleteStudentClick} />}
      </div>
      <ul>
        {students.filter((s) => s.is_active).map((s) => (
          <li key={s.id}>
            <Link to={`/student/${s.id}`}>{s.name}</Link>
          </li>
        ))}
      </ul>
      <h3>Inactive Students</h3>
      <ul>
        {students.filter((s) => !s.is_active).map((s) => (
          <li key={s.id}><Link to={`/student/${s.id}`}>{s.name}</Link></li>
        ))}
        </ul>
    </div>
  );
}
