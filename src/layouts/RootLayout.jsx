import React, { useEffect, memo } from "react";
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
import { useSession } from "../hooks/auth/useSession";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useDisclosure } from "@mantine/hooks";

function RootLayout() {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure();
  const { session, loading } = useSession();

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
              <Image src={logo} h={75} w={75} />
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
          <ScrollArea
            type="scroll"
            overscrollBehavior="contain"
            offsetScrollbars
          >
            <Flex direction="column">
            <Outlet />
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

/*import React, { Suspense, memo, useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../components/navbar/NavBar";
import Sidebar from "../components/navbar/Sidebar";
import Watermark from "antd/es/watermark";
import Spin from "antd/es/spin";
import Skeleton from "antd/es/skeleton";
import DelayedFallback from "../components/common/DelayedFallback";
import Layout from "antd/es/layout";
import Image from "antd/es/image";
import Flex from "antd/es/flex";
import logo from "../assets/logo.png";
import { useSession } from "../hooks/auth/useSession";

const { Content, Header, Footer } = Layout;

function RootLayout() {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const { session, loading } = useSession();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 600);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <DelayedFallback
        initialFallback={<Spin fullscreen tip="good to see you!" />}
        delayedFallback={
          <Spin
            fullscreen
            tip="hmmm... seems like our connection is slow, check your internet for the best performance..."
          />
        }
        delay={5000}
      />
    );
  }

  function ScrollToTopOnMount() {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

    return null;
  }

  const contentPadding = isSmallScreen ? "50px" : "16px";

  return (
    <Layout style={{ minHeight: "100vh", width: "100%" }}>
      <ScrollToTopOnMount />
      <Header
        className="header"
        style={{
          width: "100%",
          position: "fixed",
          top: 0,
          zIndex: 10,
          height: "95px",
          backgroundColor: "#0a1f3c",
        }}
      >
        <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <div className="logo">
            <Image
              className={"logo-img" + (imageLoaded ? " loaded" : "")}
              onLoad={() => setImageLoaded(true)}
              src={logo}
              preview={false}
              height="75px"
              width="75px"
            />
            <h1 className="logo-name">MockMetrics</h1>
          </div>
        </span>
        <div className="header-side"></div>
      </Header>
      <Layout style={{ marginTop: "95px" }}>
        <Sidebar
          session={session}
          isSmallScreen={isSmallScreen}
          style={{
            position: "sticky",
            top: "95px",
            left: 0,
            bottom: 0,
            padding: 0,
            zIndex: 1,
          }}
        />
        <Layout
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Watermark
            content={["MockMetrics", "Test Mode"]}
            inherit={false}
            height="40"
            width="110"
            zIndex={0}
          >
            <Content
              className="container"
              style={{
                paddingTop: "16px",
                paddingLeft: contentPadding,
                flex: 1,
              }}
            >
              <Outlet />
            </Content>
            <Footer
              style={{
                display: "flex",
                flexDirection: "row",
                backgroundColor: "#0a1f3c",
                color: "white",
                height: "clamp(50px, 7vh, 75px)",
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <h1>Footer</h1>
            </Footer>
          </Watermark>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default memo(RootLayout);
*/
