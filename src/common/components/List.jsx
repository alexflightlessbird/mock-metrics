// Dependency imports
import { List } from "@mantine/core";

export default function ListComponent({ items, withPadding = true }) {
  const listProps = {
    spacing: "xs",
    size: "md",
    center: true,
    withPadding,
    listStyleType: "disc",
  };

  const filteredItems = items.filter((item) => item !== "");

  return (
    <List {...listProps}>
      {filteredItems.map((i, index) => (
        <List.Item key={index}>{i}</List.Item>
      ))}
    </List>
  );
}
