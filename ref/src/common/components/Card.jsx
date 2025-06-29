import { Card, Image, Text, Badge, Group, Flex, Stack } from "@mantine/core";
import IconButton from "./IconButton";

export default function CardComponent({ content = {}, image }) {
    return (
        <Card 
            shadow="md" 
            padding="lg" 
            radius="md" 
            withBorder
            maw="100%"
            style={{
                height: "100%"
            }}
        >
            {image && (
                <Card.Section>
                    <Image src={image.src} height={image.height || 160} alt={image.alt} style={{ objectFit: "cover" }} />
                </Card.Section>
            )}

            <Group justify="space-between" mt="xs" mb="xs" wrap="nowrap">
                {content.title && <Text fw={800}>{content.title}</Text>}
                {content.badges && (
                    <Stack gap="xs" align="flex-end">
                        {content.badges.map((badge, index) => (
                            <Badge
                                key={index}
                                color={badge?.color || "blue"}
                                style={{
                                    color: badge?.fontColor,
                                    flexShrink: 0,
                                    width: "fit-content"
                                }}
                            >
                                {badge.text}
                            </Badge>
                        ))}
                    </Stack>
                )}
                {!content.badges && content.badge && (
                    <Badge
                        color={content.badge?.color || "blue"}
                        style={{
                            color: content.badge?.fontColor,
                            flexShrink: 0
                        }}
                    >
                        {content.badge.text}
                    </Badge>
                )}
            </Group>

            <Text size="sm" c="dimmed">
                {content?.text || ""}
            </Text>
            
            {content.button && (
                <IconButton
                    buttonText={content.button.text}
                    icon={content.button.icon}
                    onClick={content.button.onClick}
                />
            )}
        </Card>
    )
}