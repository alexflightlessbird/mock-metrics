import { Group, Stack, Text } from "@mantine/core";
import ShowIdText from "./ShowIdText";

export default function PageDetailSection({ editable = false, details }) {
    return (
        <Group justify="space-between" align="flex-start">
            {details.map(d => {
                if (d?.type === "id") return <ShowIdText key={d.name} idName={d.name} idValue={d.value} fz="sm" />;
                return (
                    <Stack key={d.name} gap="0">
                        <Text c="dimmed" fz="sm">{d.name}</Text>
                        {!editable && <Text fz="sm">{d.value}</Text>}
                        {editable && d.value}
                    </Stack>
                )
            })}
        </Group>
    )
}