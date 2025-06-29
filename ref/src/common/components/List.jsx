// Dependency imports
import { List } from "@mantine/core";

export default function ListComponent({ items, withPadding = true, listStyleType = "disc" }) {
  const listProps = {
    spacing: "xs",
    size: "md",
    center: true,
    withPadding,
    listStyleType,
  };

  const filteredItems = items.filter((item) => item !== "");

  return (
    <List {...listProps} style={{ wordBreak: "break-word", overflowWrap: "break-word", width: "100%", wordWrap: "break-word" }}>
      {filteredItems.map((i, index) => (
        <List.Item key={index}>{i}</List.Item>
      ))}
    </List>
  );
}
