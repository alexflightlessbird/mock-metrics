// Dependency imports
import { Button, Flex } from "@mantine/core";
import { useFullscreen } from "@mantine/hooks";

export default function Footer() {
  const { toggle, fullscreen } = useFullscreen();

  return (
    <>
      <Flex justify="space-around" align="center">
        Footer
        <Button onClick={toggle} color="white" variant="outline">
          {fullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        </Button>
      </Flex>
    </>
  );
}
