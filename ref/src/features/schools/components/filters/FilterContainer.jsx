import { Stack } from "@mantine/core";

export default function FilterContainer({ children, maxWidth = "700px" }) {
    return (
        <Stack gap="xs" mb="md" maw={maxWidth}>
            {children}
        </Stack>
    )
}