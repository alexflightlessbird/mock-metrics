import React from "react";
import IconButton from "./IconButton";

export default function OpenModalButton({ dialogClass, text, type }) {
  if (type !== "add" && type !== "edit" && type !== "delete") {
    throw new Error("Invalid type prop. Must be 'add', 'edit', or 'delete'.");
  }

  return (
    <IconButton
      icon={type}
      text={text}
      handleClickFunction={() =>
        document.querySelector(`.${dialogClass}`).showModal()
      }
    />
  );
}
