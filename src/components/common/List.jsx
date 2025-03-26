import React from "react";
import { List } from "@mantine/core";

export default function ListComponent({ items }) {
    const listProps = {
        spacing: "xs",
        size: "md",
        center: true,
        withPadding: true,
    }

    const filteredItems = items.filter(item => item !== "");

    return (
        <List {...listProps}>
            {filteredItems.map((i, index) => <List.Item key={index}>{i}</List.Item>)}
        </List>
    )
}