import {
  Container,
  Title,
  Text,
  Button,
  Flex,
  Anchor
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import GavelLoader from "../common/components/loader/GavelLoader";

export default function Error404() {
  const navigate = useNavigate();

  return (
    <Container fluid>
      <Flex
        direction="column"
        justify="center"
        align="center"
      >
        <Title order={1}>404 - Page Not Found</Title>
        <Text>Hmmm... It seems like the page you're looking for doesn't exist.</Text>
        <Text>Want us to build it or think it should be here? Submit a <Anchor href="https://github.com/alexflightlessbird/mock-metrics/issues" target="_blank" underline="hover">feature request or bug report on GitHub!</Anchor></Text>
        <GavelLoader scale={2} />
        <Button onClick={() => navigate("/")} mt="md">
          Return to Home
        </Button>
      </Flex>
    </Container>
  );
}
