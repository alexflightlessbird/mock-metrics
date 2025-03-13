import React from "react";
import IconButton from "../buttons/IconButton";

export default function AssigneesList({ assignees, schoolId }) {
  const handlEditUserRolesClick = () => {
    window.alert("Editing user roles - will be dialog");
  };

  const handleAddUserClick = () => {
    window.alert("Add user - will be dialog");
  };

  const handleRemoveUserClick = () => {
    window.alert("Remove user - will be dialog");
  };

  return (
    <div>
      <h2>School Users</h2>
      <div>
        <IconButton
          icon="add"
          text="Add User"
          handleClickFunction={handleAddUserClick}
        />
        <IconButton
          icon="edit"
          text="Edit User Roles"
          handleClickFunction={handlEditUserRolesClick}
        />
        <IconButton
          icon="delete"
          text="Remove User"
          handleClickFunction={handleRemoveUserClick}
        />
      </div>
      <h3>Primary Admins</h3>
      <ul>
        {assignees
          .filter((a) => a.role === "Primary")
          .map((a, index) => (
            <li key={index}>
              <p>Name: {a.users.name}</p>
              <p>Email: {a.users.email}</p>
            </li>
          ))}
      </ul>
      <h3>Standard Admins</h3>
      <ul>
        {assignees
          .filter((a) => a.role === "Admin")
          .map((a, index) => (
            <li key={index}>
              <p>Name: {a.users.name}</p>
              <p>Email: {a.users.email}</p>
            </li>
          ))}
      </ul>
      <h3>Viewers</h3>
      <ul>
        {assignees
          .filter((a) => a.role === "Viewer")
          .map((a, index) => (
            <li key={index}>
              <p>Name: {a.users.name}</p>
              <p>Email: {a.users.email}</p>
            </li>
          ))}
      </ul>
    </div>
  );
}
