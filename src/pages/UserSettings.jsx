import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useSession } from "../common/hooks/auth/useSession";
import { setDocumentTitle } from "../utils/helpers";
import List from "../common/components/List";
import { Flex, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { hasLength, useForm } from "@mantine/form";
import { EditIcon } from "../common/components/ActionIcons";
import IconButton from "../common/components/IconButton";

export default function UserSettings() {
  const { userId } = useSession();
  const [user, setUser] = useState();
  const [reload, setReload] = useState(false);
  const [detailItems, setDetailItems] = useState([]);
  const [opened, { open, close }] = useDisclosure();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) console.error("Error fetching user:", error);
      else setUser(data);
    };
    fetchUser();
  }, [userId, reload]);

  const triggerReload = () => {
    setReload(!reload);
  };

  useEffect(() => {
    setDocumentTitle({ title: "User Settings" });
  }, []);

  useEffect(() => {
    setDetailItems([
      `Name: ${user?.name}`,
      `Email: ${user?.email}`,
      `User ID (for support purposes only): ${userId}`,
    ]);
  }, [user, userId]);

  const editUserForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: user?.name || "",
    },
    validate: {
      name: hasLength(
        { min: 2, max: 40 },
        "Names must be 2-40 characters long"
      ),
    },
  });

  const handleEditSubmit = async (values, e) => {
    e.preventDefault();
    try {
      if (values.name === user.name) {
        close();
        return;
      }
      const { error } = await supabase
        .from("users")
        .update({ name: values.name })
        .eq("id", userId);

      if (error) throw error;
      close();
      triggerReload();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div style={{ height: "200vh" }}>
      <h1>Settings Page</h1>
      <Flex style={{ alignItems: "center", gap: "7px" }}>
        <h2>User Details</h2>
        <EditIcon onClick={open} />
        <Modal opened={opened} onClose={close} title="Edit User Details">
          <form onSubmit={editUserForm.onSubmit(handleEditSubmit)}>
            <TextInput
              label="Name"
              withAsterisk
              key={editUserForm.key("name")}
              placeholder="Enter your preferred name"
              {...editUserForm.getInputProps("name")}
            />
            <br />
            <IconButton icon="save" type="submit" buttonText="Submit" />
          </form>
        </Modal>
      </Flex>
      <List items={detailItems} />
    </div>
  );
}
