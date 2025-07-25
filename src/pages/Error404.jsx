import {
  Text,
  Button,
  Anchor,
  Center
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import GavelLoader from "../common/components/loader/GavelLoader";
import BasePage from "../common/components/BasePage";

export default function Error404() {
  const navigate = useNavigate();

  return (
    <BasePage titleText="Rule 404 Violation" centerTitle={true} styleProps={{ height: "calc(100vh- var(--mantine-header-height))", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Text ta="center">Hmmm... It seems like the page you're looking for doesn't exist.</Text>
        <Text ta="center">Want us to build it or think it should be here? Submit a <Anchor href="https://github.com/alexflightlessbird/mock-metrics/issues" target="_blank" underline="hover">feature request or bug report on GitHub!</Anchor></Text>
      <GavelLoader scale={2} />
      <Center>
        <Button onClick={() => navigate("/")} mt="md">
          Return to Home
        </Button>
      </Center>
    </BasePage>
  );
}
