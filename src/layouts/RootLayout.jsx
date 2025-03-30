import { useEffect, memo } from "react";
import {
  AppShell,
  Image,
  Text,
  Flex,
  useMantineTheme,
  Burger,
  Group,
  ScrollArea,
} from "@mantine/core";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useSession } from "../common/hooks/auth/useSession";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useDisclosure } from "@mantine/hooks";

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
        transitionDuration={500}
        navbar={{
          width: { base: "55vw", xs: "95px" },
          breakpoint: "xs",
          collapsed: { mobile: !opened },
        }}
        header={{ height: 95 }}
        footer={{ height: 60 }}
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
              color={theme.colors.lightGray[0]}
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
          style={{
            backgroundColor: theme.colors.darkBlue[0],
            color: theme.colors.lightGray[0],
            zIndex: 100,
          }}
        >
          <ScrollArea
            type="scroll"
            offsetScrollbars
            overscrollBehavior="contain"
          >
            <Flex direction="column" align="center">
              <Sidebar opened={opened} toggle={toggle} session={session} />
            </Flex>
          </ScrollArea>
        </AppShell.Navbar>
        <AppShell.Main
          style={{
            backgroundColor: theme.colors.lightGray[0],
            color: theme.colors.darkBlue[0],
          }}
        >
          <Flex direction="column">
            <Outlet />
          </Flex>
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
