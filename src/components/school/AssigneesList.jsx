import React, { useState, useEffect } from "react";
import ListComponent from "../common/ListComponent";
import OpenModalButton from "../common/OpenModalButton";

export default function AssigneesList({ assignees, schoolId }) {
  const [primaryAdmins, setPrimaryAdmins] = useState([]);
  const [standardAdmins, setStandardAdmins] = useState([]);
  const [viewers, setViewers] = useState([]);

  useEffect(() => {
    setPrimaryAdmins(
      assignees
        .filter((a) => a.role === "Primary")
        .map((a) => a.users)
        .flat()
    );
    setStandardAdmins(
      assignees
        .filter((a) => a.role === "Admin")
        .map((a) => a.users)
        .flat()
    );
    setViewers(
      assignees
        .filter((a) => a.role === "Viewer")
        .map((a) => a.users)
        .flat()
    );
  }, [assignees]);

  const handleEditUserRolesClick = () => {
    window.alert("Edit user roles");
  };

  const handleAddUserClick = () => {
    window.alert("Add user");
  };

  const handleRemoveUserClick = () => {
    window.alert("Remove user");
  };

  const renderAssignee = (assignee) => (
    <span>
      {assignee.name} (<em>{assignee.email}</em>)
    </span>
  );

  return (
    <div>
      <h2>School Users</h2>
      <div>
        <OpenModalButton
          type="add"
          text="Add User"
          dialogClass="add-user-dialog"
        />
        <OpenModalButton
          type="edit"
          text="Edit User Roles"
          dialogClass="edit-user-roles-dialog"
        />
        <OpenModalButton
          type="delete"
          text="Remove User"
          dialogClass="remove-user-dialog"
        />
      </div>
      <ListComponent
        items={primaryAdmins}
        title="Primary Admins"
        emptyMessage="No primary admins."
        renderItem={renderAssignee}
      />
      <ListComponent
        items={standardAdmins}
        title="Standard Admins"
        emptyMessage="No standard admins."
        renderItem={renderAssignee}
      />
      <ListComponent
        items={viewers}
        title="Viewers"
        emptyMessage="No viewers."
        renderItem={renderAssignee}
      />
    </div>
  );
}
