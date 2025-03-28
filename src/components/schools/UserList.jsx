import React from "react";
import List from "../../common/components/List";
import { Flex, Text, Select } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { EditIcon, DeleteIcon } from "../../common/components/ActionIcons";
import IconButton from "../../common/components/NewIconButton";
import { ROLES } from "../../utils/constants";
import { useSession } from "../../common/hooks/auth/useSession";
import { useSchoolDataMutations } from "../../hooks/api/useSchoolData";

export default function UserList({
  users,
  isPremium,
  schoolId,
  schoolName
}) {
  const { updateUserRole, removeUserFromSchool } = useSchoolDataMutations();
  const { userId } = useSession();

  const editUserForm = useForm({
    mode: "uncontrolled",
    onSubmitPreventDefault: "always",
    validateInputOnBlur: true,
  });

  const handleEditUserSubmit = async (values) => {
    const { role, currentRole, user_id } = values;

    const roleChanged = role !== currentRole;

    if (!roleChanged) {
      modals.closeAll();
      return;
    }

    try {
      await updateUserRole({
        userId: user_id,
        role,
        schoolId,
      });
      modals.closeAll();
    } catch (error) {
      console.error("User role update failed:", error);
    }
  }

  const editUserModal = (user) => {
    editUserForm.reset();
    editUserForm.setInitialValues({
      role: user.role,
      user_id: user.user_id,
      currentRole: user.role,
    });

    editUserForm.setValues({
      role: user.role,
      user_id: user.user_id,
      currentRole: user.role,
    });

    if (user.role === ROLES.PRIMARY && users.length === 1) {
      return modals.open({
        title: "Oops",
        centered: true,
        children: (
          <>
            <Text>
              You can't change the role of a primary admin if there's only one!{" "}
              {isPremium ? (
                <span>To make changes, add another primary admin first.</span>
              ) : (
                <span>To change the primary admin, please contact MSU Mock Trial.</span>
              )}
            </Text>
          </>
        )
      })
    }

    if (user.user_id === userId) {
      return modals.open({
        title: "Oops",
        centered: true,
        children: (
          <>
            <Text>You can't modify your own role in a school assignment.</Text>
          </>
        )
      })
    }

    modals.open({
      title: `Edit Details: ${user.users.email}`,
      centered: true,
      children: (
        <>
          <Text>User Id: {user.user_id}</Text>
          <form onSubmit={editUserForm.onSubmit(handleEditUserSubmit)}>
            <Select
              label="New Role"
              withAsterisk
              placeholder="Pick role"
              key={editUserForm.key("role")}
              data={[ROLES.PRIMARY, ROLES.ADMIN, ROLES.VIEWER]}
              {...editUserForm.getInputProps("role")}
            />
            <br />
            <IconButton icon="save" type="submit" buttonText="Submit" />
          </form>
        </>
      )
    })
  }

  const removeUserModal = (user) => {
    if (user.role === ROLES.PRIMARY && users.length === 1) {
      return modals.open({
        title: "Oops",
        centered: true,
        children: (
          <>
            <Text>You can't remove the only primary admin!</Text>
          </>
        )
      });
    }

    if (user.user_id === userId) {
      return modals.open({
        title: "Oops",
        centered: true,
        children: (
          <>
            <Text>You can't remove yourself from a school assignment.</Text>
          </>
        )
      })
    }

    modals.openConfirmModal({
      title: "Remove User",
      centered: true,
      children: (
        <Text>Are you sure you want to remove {user.users.name} from {schoolName}?</Text>
      ),
      labels: { confirm: "Remove User", cancel: "Cancel" },
      onConfirm: async () => {
        await removeUserFromSchool({ userId: user.user_id, schoolId });
        modals.closeAll();
      }
    })
  }

  const mappedUsers = [];

  users.map((u) => {
    mappedUsers.push(
      <Flex style={{ alignItems: "center", gap: "7px" }}>
        <Text>{u.users.name} ({u.users.email})</Text>
        {u.user_id !== userId && (
          <>
            <EditIcon onClick={() => editUserModal(u)} />
            <DeleteIcon onClick={() => removeUserModal(u)} />
          </>
        )}
      </Flex>
    )
  })

  if (mappedUsers.length == 0) mappedUsers.push("None");

  return <List items={mappedUsers} />;
}