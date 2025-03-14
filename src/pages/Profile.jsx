import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useSession } from "../context/SessionContext";
import Dialog from "../components/common/dialogs/Dialog";
import IconButton from "../components/common/buttons/IconButton";

export default function Profile() {
  const { userId } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase
      .from("users")
      .select("name, email")
      .eq("id", userId)
      .then(({ data, error }) => {
        console.log(data);
        if (error || data.length === 0) {
          setError(
            error?.message ||
              "An error occurred. Please try logging in again. If the problem persists, contact developers."
          );
          setLoading(false);
        } else if (data) {
          setName(data[0].name || data[0].email);
          setEmail(data[0].email);
          setLoading(false);
        }
      });
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  document.title = `${name} - MockMetrics`;

  const handleEditNameClick = () => {
    const dialog = document.querySelector(".edit-name-dialog");
    dialog.showModal();
  };

  const handleEditNameSubmit = (values) => {
    const newName = values["name"];
    if (newName === name) return;

    supabase
      .from("users")
      .update({ name: newName })
      .eq("id", userId)
      .then(({ error }) => {
        if (error) {
          console.error("Error updating name:", error);
        } else {
          setName(newName);
        }
      });
  };

  return (
    <div>
      <h1>Welcome, {name}</h1>
      <ul>
        <li>
          Name: {name}
          {name === email ? (
            <ul>
              <li>
                Looks like you haven't set your name yet. Use the button below.
              </li>
            </ul>
          ) : (
            ""
          )}
        </li>
        <li>Email: {email}</li>
      </ul>
      <IconButton
        handleClickFunction={handleEditNameClick}
        icon="edit"
        text="Edit name"
      />
      <br />
      <Dialog
        className="edit-name-dialog"
        legendText="Edit Name"
        handleSubmit={handleEditNameSubmit}
        questions={[
          {
            type: "text",
            id: "name",
            label: "Name",
            disabled: false,
            required: true,
            value: name,
            maxLength: 30,
            description: "Max of 30 characters",
          },
        ]}
      />
    </div>
  );
}
