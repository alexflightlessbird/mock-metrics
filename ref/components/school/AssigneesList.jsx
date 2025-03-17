import React, { useState, useEffect } from "react";
import OpenModalButton from "../common/buttons/OpenModalButton";
import ListWithLoader from "../common/lists/ListWithLoader";
import { filterAssigneesByRole } from "../../utils/helpers/assigneeHelpers";

export default function AssigneesList({ assignees, schoolId, loading, error }) {
  const [primaryAdmins, setPrimaryAdmins] = useState([]);
  const [standardAdmins, setStandardAdmins] = useState([]);
  const [viewers, setViewers] = useState([]);


  useEffect(() => {
    setPrimaryAdmins(filterAssigneesByRole(assignees, "Primary"));
    setStandardAdmins(filterAssigneesByRole(assignees, "Admin"));
    setViewers(filterAssigneesByRole(assignees, "Viewer"));
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
      <ListWithLoader 
        items={primaryAdmins}
        title="Primary Admins"
        emptyMessage="No primary admins."
        renderItem={renderAssignee}
        loading={loading}
        error={error}
      />
      <ListWithLoader
        items={standardAdmins}
        title="Standard Admins"
        emptyMessage="No standard admins."
        renderItem={renderAssignee}
        loading={loading}
        error={error}
      />
      <ListWithLoader
        items={viewers}
        title="Viewers"
        emptyMessage="No viewers."
        renderItem={renderAssignee}
        loading={loading}
        error={error}
      />
    </div>
  );
}
