import React, { Suspense, memo, useState, useEffect } from "react";
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

  function ScrollToTopOnMount() {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  
    return null;
  }

  return (
    <Layout style={{ minHeight: "100vh", width: "100%" }}>
      <ScrollToTopOnMount />
      <Header
        className="header"
        style={{ width: "100%", position: "fixed", top: 0, zIndex: 1, height: "95px", backgroundColor: "#0a1f3c" }}
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
        <Sidebar session={session} style={{ position: "sticky", top: "95px", left: 0, zIndex: 1, bottom: 0, height: "calc(100vh - 95px - 48px)", padding: 0 }} />
        <Layout style={{ display: "flex", flexDirection: "column" }}>
          <Content className="container" style={{ padding: "16px", minHeight: "calc(100vh - 95px)", flex: 1 }}>
            <Outlet />
          </Content>
          <Footer style={{ display: "flex", flexDirection: "row", backgroundColor: "red", height: "200px", overflow: "hidden", alignItems: "flex-end", justifyContent: "center"}}><h1 style={{height: "95%"}}>Footer</h1></Footer>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default memo(RootLayout);
