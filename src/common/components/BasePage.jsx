import { Container, Title, Space } from "@mantine/core";

export default function BasePage({ titleText, children, centerTitle = false, styleProps = {} }) {
    return (
        <Container fluid style={{ ...styleProps }}>
            <Title order={1} style={{ justifySelf: centerTitle ? "center" : "" }}>{titleText}</Title>
            <Space h="md" />

            {children}
        </Container>
    )
}