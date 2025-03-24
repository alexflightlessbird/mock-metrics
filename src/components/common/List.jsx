import React from "react";
import { List } from "@mantine/core";

export default function ListComponent({ items }) {
    const listProps = {
        spacing: "xs",
        size: "md",
        center: true,
        withPadding: true,
    }
    return (
        <List {...listProps}>
            {items.map((i, index) => <List.Item key={index}>{i}</List.Item>)}
        </List>
    )
}