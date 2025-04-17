import { Space, SimpleGrid } from "@mantine/core";
import Card from "./Card";
import List from "./List";

export default function CardList({ items }) {
    const filteredItems = items.filter((item) => (item.text !== "" && item.text !== undefined) || (item.title !== "" && item.title !== undefined));

    return (
        <SimpleGrid
            cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
            spacing="xs"
            verticalSpacing="xs"
        >
        {filteredItems.length === 0 && <List items={["None"]} />}
        {filteredItems.length > 0 && filteredItems.map((i, index) => (
            <>
                <Card
                    key={index}
                    image= {i?.image}
                    content={{
                        title: i?.title,
                        text: i?.text,
                        badge: i?.badge,
                        button: i?.button
                    }}
                />
            </>
        ))}
        </SimpleGrid>
    )
}