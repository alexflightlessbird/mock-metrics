import React, { useEffect, useState } from "react";
import icons from "../../utils/icons";
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import { useNavigate, useLocation } from "react-router-dom";
import Flex from "antd/es/flex";

const { Sider } = Layout;

// Helper function to generate unique keys
function generateKeys(items, prefix = "") {
  return items.map((item, index) => {
    const key = prefix ? `${prefix}-${index}` : `${index}`;
    if (item.children) {
      item.children = generateKeys(item.children, key);
    }
    return { ...item, key };
  });
}

// Helper function to find the key for the current path
function findKey(items, path) {
  for (const item of items) {
    if (item.navigatePath === path) {
      return item.key;
    }
    if (item.children) {
      const foundKey = findKey(item.children, path);
      if (foundKey) return foundKey;
    }
  }
  return null;
}

const commonItems = [
  {
    label: "Home",
    icon: React.createElement(icons.home),
    navigatePath: "/",
  },
];

const loggedOutItems = [];

const loggedInItems = [
  {
    label: "Test",
    icon: React.createElement(icons.dashboard),
    navigatePath: "/test",
  },
  {
    label: "Details",
    icon: React.createElement(icons.info),
    navigatePath: null,
    children: [
      {
        label: "Cases",
        icon: React.createElement(icons.openbook),
        navigatePath: "/cases",
      },
      {
        label: "Witnesses",
        icon: React.createElement(icons.contact),
        navigatePath: "/witnesses",
      },
      {
        label: "Schools",
        icon: React.createElement(icons.school),
        navigatePath: "/schools",
      },
      {
        label: "Tournaments",
        icon: React.createElement(icons.trophy),
        navigatePath: "/tournaments",
      },
      {
        label: "Teams",
        icon: React.createElement(icons.team),
        navigatePath: "/teams",
      },
      {
        label: "Students",
        icon: React.createElement(icons.idcard),
        navigatePath: "/students",
      },
    ],
  },
];

export default function Sidebar({ session, style, isSmallScreen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);
  const [selectedKey, setSelectedKey] = useState([""]);

  const mainItems = session
    ? commonItems.concat(loggedInItems)
    : commonItems.concat(loggedOutItems);

  const sessionItem = session
    ? [
        {
          label: "Logout",
          icon: React.createElement(icons.logout),
          navigatePath: "/auth",
          className: "logout-item",
        },
        {
          label: "Profile Settings",
          icon: React.createElement(icons.settings),
          navigatePath: "/settings",
        },
      ]
    : [
        {
          label: "Login/Register",
          icon: React.createElement(icons.login),
          navigatePath: "/auth",
          className: "login-item",
        },
      ];

  // Generate unique keys for both menus
  const generatedMainItems = generateKeys(mainItems, "main");
  const generatedSessionItems = generateKeys(sessionItem, "session");

  // Convert to Ant Design Menu items
  const mainMenuItems = generatedMainItems.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
    children: item.children,
  }));

  const sessionMenuItems = generatedSessionItems.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
    children: item.children,
  }));

  // Update selected key when location changes
  useEffect(() => {
    const currentKey =
      findKey(generatedMainItems, location.pathname) ||
      findKey(generatedSessionItems, location.pathname);
    if (currentKey) {
      setSelectedKey([currentKey]);
    }
  }, [location.pathname, session]);

  // Handle menu item selection
  const handleMenuSelect = (key, items) => {
    const item = findItemByKey(items, key);
    if (item && item.navigatePath) {
      navigate(item.navigatePath);
    }
  };

  // Helper function to find an item by its key
  function findItemByKey(items, key) {
    for (const item of items) {
      if (item.key === key) {
        return item;
      }
      if (item.children) {
        const foundItem = findItemByKey(item.children, key);
        if (foundItem) return foundItem;
      }
    }
    return null;
  }

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
    height: "calc(100vh - 95px - 48px)",
  };

  return (
    <Sider
      {...(isSmallScreen ? smallSliderProps : commonSliderProps)}
      style={isSmallScreen ? smallStyle : commonStyle}
    >
      <Flex
        vertical
        style={{
          height: "100%",
          justifyContent: "flex-start",
          margin: 0,
          overflow: "auto",
        }}
      >
        <Menu
          selectedKeys={selectedKey}
          mode="inline"
          items={sessionMenuItems}
          onSelect={({ key }) => handleMenuSelect(key, generatedSessionItems)}
          style={{ marginBottom: "50px" }}
          forceSubMenuRender={true}
        />
        <Menu
          selectedKeys={selectedKey}
          mode="inline"
          items={mainMenuItems}
          onSelect={({ key }) => handleMenuSelect(key, generatedMainItems)}
          forceSubMenuRender={true}
        />
      </Flex>
    </Sider>
  );
}
