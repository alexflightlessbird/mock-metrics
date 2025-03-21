import React, { useEffect, useState } from "react";
import icons from "../../utils/icons";
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import { useNavigate, useLocation } from "react-router-dom";
import { Flex, Space } from "antd"; // Import Flex from Ant Design

const { Sider } = Layout;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

export default function Sidebar({ session, style, isSmallScreen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);
  const [selectedKey, setSelectedKey] = useState([""]);

  const mainItems = session
    ? //logged in
      [
        {
          label: "Home",
          icon: React.createElement(icons.home),
          navigatePath: "/",
        },
        {
          label: "Settings",
          icon: React.createElement(icons.settings),
          navigatePath: "/settings",
        },
        {
          label: "Test",
          icon: React.createElement(icons.dashboard),
          navigatePath: "/test",
        },
      ]
    : //not logged in
      [
        {
          label: "Home",
          icon: React.createElement(icons.home),
          navigatePath: "/",
        },
        {
          label: "Test",
          icon: React.createElement(icons.dashboard),
          navigatePath: "/test",
        },
      ];

  const sessionItem = session
    ? [
        {
          label: "Logout",
          icon: React.createElement(icons.logout),
          navigatePath: "/logout",
          className: "logout-item",
        },
      ]
    : [
        {
          label: "Login/Register",
          icon: React.createElement(icons.login),
          navigatePath: "/login",
          className: "login-item",
        },
      ];

  const mainMenuItems = mainItems.map((item, index) =>
    getItem(item.label, index, item?.icon, item?.children)
  );

  const sessionItems = sessionItem.map((item, index) =>
    getItem(item.label, mainItems.length + index, item?.icon, item?.children)
  );

  useEffect(() => {
    const currentItem = mainItems
      .concat(sessionItem)
      .find((item) => item.navigatePath === location.pathname);
    if (currentItem) {
      const itemIndex = mainItems.concat(sessionItem).indexOf(currentItem);
      setSelectedKey([itemIndex.toString()]);
    }
  }, [location.pathname, session]);

  const smallSliderProps = {
    breakpoint: "600px",
    collapsedWidth: "0",
    onBreakpoint: (broken) => setCollapsed(broken),
    collapsible: true,
    collapsed,
    onCollapse: (value) => setCollapsed(value),
  };

  const commonSliderProps = {
    collapsible: true,
    collapsed,
    onCollapse: (value) => setCollapsed(value),
    breakpoint: null,
  };

  const smallStyle = {
    ...style,
    height: "calc(100vh - 95px)",
  };

  const commonStyle = {
    ...style,
    height: "calc(100vh - 95px - 48px)"
  }

  return (
    <Sider
      {...(isSmallScreen ? smallSliderProps : commonSliderProps)}
      style={isSmallScreen ? smallStyle : commonStyle}
      >
      <Flex
        vertical
        style={{ height: "100%", justifyContent: "flex-start", margin: 0, overflow: "auto" }}
        >
          <Menu
            selectedKeys={selectedKey}
            mode="inline"
            items={sessionItems}
            onSelect={({ key }) =>
              navigate(sessionItem[key - mainItems.length].navigatePath)
          }
          style={{ marginBottom: "50px", }}
          />
        <Menu
          selectedKeys={selectedKey}
          mode="inline"
          items={mainMenuItems}
          onSelect={({ key }) => navigate(mainItems[key].navigatePath)}
          />
      </Flex>
    </Sider>
  );
}
