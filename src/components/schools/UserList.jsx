import React from "react";
import List from "../common/List";
import { Flex, Text, Select } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { EditIcon, DeleteIcon } from "../common/ActionIcons";
import IconButton from "../common/buttons/NewIconButton";
import { ROLES } from "../../utils/constants";

export default function UserList({ users, triggerReload }) {
    const editUserForm =
        useForm({
            mode: "uncontrolled",
        });

    const handleEditUserSubmit = async (values, e) => {
        e.preventDefault();
        console.log(values);
    }

    const editUserModal = (user) => {
        console.log(user);
        editUserForm.setInitialValues({
            role: user.role,
            user_id: user.user_id
        })

        modals.open({
            title: `Edit Details: ${user.users.email}`,
            children: (
                <>
                    <Text>User ID: {user.user_id}</Text>
                    <form onSubmit={editUserForm.onSubmit(handleEditUserSubmit)}>
                        <Select
                            label="New role"
                            withAsterisk
                            key={editUserForm.key("role")}
                            placeholder="Pick role"
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

    const mappedUsers = [];

    users.map((u) => 
        mappedUsers.push(
            <Flex style={{ alignItems: "center", gap: "7px" }}>
                <Text>{u.users.name} ({u.users.email})</Text>
                <EditIcon onClick={() => editUserModal(u)}/>
                <DeleteIcon />
            </Flex>
        )
    )

    if (mappedUsers.length == 0) mappedUsers.push("None")
    
    return <List items={mappedUsers} />
}