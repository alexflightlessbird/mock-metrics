import React from "react";
import List from "../common/List";
import { Flex, Text, Select } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { EditIcon, DeleteIcon } from "../common/ActionIcons";
import IconButton from "../common/buttons/NewIconButton";
import { ROLES } from "../../utils/constants";
import { supabase } from "../../services/supabaseClient";
import { useSession } from "../../hooks/auth/useSession";

export default function UserList({ users, triggerReload, isPremium, schoolId }) {
    const editUserForm = useForm({
        mode: "uncontrolled",
        onSubmitPreventDefault: "always",
        validateInputOnBlur: true,
    });

    const { userId } = useSession();

    const handleEditUserSubmit = async (values) => {
        try {
            if (values.role === values.currentRole) {
                modals.closeAll();
                return;
            }
            const { error } = await supabase
                .from("users_schools")
                .update({ role: values.role })
                .eq("user_id", values.user_id)
                .eq("school_id", schoolId);
            if (error) throw error;
            modals.closeAll();
            if (values.user_id === userId) return window.location.reload();
            triggerReload();
        } catch (error) {
            console.error("Error updating role:", error);
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
            currentRole: user.role
        });

        if (user.role === "Primary" && users.length === 1) {
            return modals.open({
                title: "Oops",
                children: (
                    <>
                        <Text>You can't change the role of a primary admin if there's only one!{" "}{isPremium ? <span>To make changes, add another primary admin first.</span> : <span>To change the primary admin, please contact MSU Mock Trial.</span>}</Text>
                    </>
                )
            })
        }

        modals.open({
            title: `Edit Details: ${user.users.email}`,
            children: (
                <>
                    <Text>User ID: {user.user_id}</Text>
                    <form onSubmit={editUserForm.onSubmit(handleEditUserSubmit)}>
                        <Select
                            label="New role"
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
        if (user.role === "Primary" && users.length === 1) {
            return modals.open({
                title: "Oops",
                children: (
                    <>
                        <Text>You can't remove the only primary admin!</Text>
                    </>
                )
            })
        }

        if (user.user_id === userId) {
            return modals.open({
                title: "Oops",
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
                <Text>Are you sure you want to remove {user.users.name} from this school?</Text>
            ),
            labels: { confirm: "Remove User", cancel: "Cancel" },
            onConfirm: async () => {
                const { error } = await supabase
                    .from("users_schools")
                    .delete()
                    .eq("user_id", user.user_id);
                if (error) console.error("Error removing user:", error);
                triggerReload();
            }
        })
    }
    
    const mappedUsers = [];

    users.map((u) => {
        mappedUsers.push(
            <Flex style={{ alignItems: "center", gap: "7px" }}>
                <Text>{u.users.name} ({u.users.email})</Text>
                <EditIcon onClick={() => editUserModal(u)}/>
                <DeleteIcon onClick={() => removeUserModal(u)}/>
            </Flex>
        )
    })

    if (mappedUsers.length == 0) mappedUsers.push("None")
    
    return <List items={mappedUsers} />
}