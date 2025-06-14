// Dependency imports
import { useEffect, memo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  AppShell,
  Image,
  Text,
  Flex,
  useMantineTheme,
  Burger,
  Group,
  ScrollArea,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

// Component imports
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import logo from "../assets/logo.png";

// Hooks imports
import { useSession } from "../common/hooks/auth/useSession";

function RootLayout() {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure();
  const { session } = useSession();

  function ScrollToTopOnMount() {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

    return null;
  }

  return (
    <>
      <ScrollToTopOnMount />
      <AppShell
        padding="xs"
        style={{ minHeight: "100vh", overflow: "hidden" }}
        w="100%"
        transitionDuration={500}
        navbar={{
          width: { base: "55vw", xs: "95px" },
          breakpoint: "xs",
          collapsed: { mobile: !opened },
        }}
        header={{ height: "95px" }}
        footer={{ height: "60px" }}
      >
        <AppShell.Header
          p="xs"
          withBorder={false}
          style={{
            backgroundColor: theme.colors.darkBlue[0],
            color: theme.colors.lightGray[0],
          }}
        >
          <Flex
            direction="row"
            align="center"
            gap="xs"
            justify={{ base: "center", xs: "flex-start" }}
          >
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="xs"
              size="sm"
              color="lightGray"
              style={{ position: "absolute", left: "5vw" }}
            />
            <Group
              onClick={() => navigate("/")}
              align="center"
              gap="xs"
              style={{ cursor: "pointer" }}
            >
              <Image src={logo} h={75} w={75} alt="logo" />
              <Text style={{ fontFamily: "Trirong", fontSize: "2rem" }}>
                MockMetrics
              </Text>
            </Group>
          </Flex>
        </AppShell.Header>
        <AppShell.Navbar
          p="xs"
          withBorder={false}
          style={{
            backgroundColor: theme.colors.darkBlue[0],
            color: theme.colors.lightGray[0],
            zIndex: 100,
          }}
        >
          <ScrollArea
            type="scroll"
            overscrollBehavior="contain"
            scrollbars="y"
          >
            <Sidebar opened={opened} toggle={toggle} session={session} />
          </ScrollArea>
        </AppShell.Navbar>
        <AppShell.Main
          style={{
            backgroundColor: theme.colors.lightGray[0],
            color: theme.colors.darkBlue[0],
            height: "calc(100vh - 95px - 60px)",
            overflow: "hidden"
          }}
        >
          <ScrollArea
            h="100%"
            type="scroll"
            scrollbars="y"
          >
            <Flex direction="column" style={{ marginBottom: 50 }}>
              <Box maw="100%" pl="sm" pr="sm">
                <Outlet />
              </Box>
            </Flex>
          </ScrollArea>
        </AppShell.Main>
        <AppShell.Footer
          p="xs"
          withBorder={false}
          style={{
            backgroundColor: theme.colors.darkBlue[0],
            color: theme.colors.lightGray[0],
          }}
        >
          <Footer />
        </AppShell.Footer>
      </AppShell>
    </>
  );
}

export default memo(RootLayout);
