// Dependency imports
import { Text } from "@mantine/core";

export default function NotFound({ type = "case" }) {
    return (
        <>
            <br/>
            <Text>No {type} found for that ID.</Text>
        </>)
}