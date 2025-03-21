import React, { Suspense, memo, useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/navbar/NavBar";
import Sidebar from "../components/navbar/Sidebar";
import Watermark from "antd/es/watermark";
import Spin from "antd/es/spin";
import Skeleton from "antd/es/skeleton";
import DelayedFallback from "../components/common/DelayedFallback";
import Layout from "antd/es/layout";
import Image from "antd/es/image";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useSession } from "../hooks/auth/useSession";
import { Flex } from "antd";

const { Content, Header, Footer } = Layout;

function RootLayout() {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const { session, loading } = useSession();

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

  return (
    <Layout style={{ minHeight: "100vh", width: "100%" }}>
      <Header
        className="header"
        style={{ width: "100%", position: "sticky", top: 0, zIndex: 1 }}
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
      <Sidebar session={session} style={{ height: "100vh" }} />
      <Flex style={{ minHeight: "200vh" }}>
        <Layout>
          <Content className="container">
            <Outlet />
          </Content>
        </Layout>
      </Flex>
      <Footer>{/* footer here */}</Footer>
    </Layout>
  );
}

export default memo(RootLayout);
