// Dependency imports
import { useState, createElement } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Tooltip,
  Flex,
  Box,
  Text,
  useMantineTheme,
  Divider,
  ActionIcon
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

// Utils imports
import icons from "../utils/icons";

export default function Sidebar({ session, opened, toggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useMantineTheme();
  const [expandedItems, setExpandedItems] = useState({});
  const isLargeScreen = useMediaQuery("(min-width: 36em)"); // Adjust the breakpoint as needed

  const commonItems = [
    {
      label: "Home",
      icon: createElement(icons.home),
      navigatePath: "/",
    },
  ];

  const loggedOutItems = [];

  const loggedInItems = [
    {
      label: "Test",
      icon: createElement(icons.dashboard),
      navigatePath: "/test",
    },
    {
      label: "Details",
      icon: createElement(icons.info),
      navigatePath: null,
      children: [
        {
          label: "Cases",
          icon: createElement(icons.openbook),
          navigatePath: "/cases",
        },
        {
          label: "Schools",
          icon: createElement(icons.school),
          navigatePath: "/schools",
        },
      ],
    },
  ];

  const sessionItem = session
    ? [
        {
          label: "Logout",
          icon: createElement(icons.logout),
          navigatePath: "/auth",
        },
        {
          label: "Profile Settings",
          icon: createElement(icons.settings),
          navigatePath: "/settings",
        },
      ]
    : [
        {
          label: "Login/Register",
          icon: createElement(icons.login),
          navigatePath: "/auth",
        },
      ];

  const mainItems = session
    ? commonItems.concat(loggedInItems)
    : commonItems.concat(loggedOutItems);

  function handleNavigate (path) {
    if (opened) toggle(); // Close the sidebar if it's in the mobile view
    navigate(path);
  };

  function toggleChildren (label) {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  function isChildActive (children) {
    return children?.some((child) => location.pathname === child.navigatePath);
  };

  function renderItem (item, index) {
    const isActive = location.pathname === item.navigatePath;
    const hasActiveChild = isChildActive(item.children);

    return (
      <Box key={index} maw="70px" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {isLargeScreen ? (
          <Tooltip label={item.label} position="right" withArrow>
            <Box
              onClick={() => {
                if (item.children) toggleChildren(item.label);
                else handleNavigate(item.navigatePath);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                //padding: "10px",
                padding: "5px 0px",
                //margin: "5px",
                //borderRadius: "8px",
                cursor: "pointer",
                //backgroundColor: isActive
                //? theme.colors.primaryBlue[0]
                //  : "transparent",
                color: hasActiveChild
                  ? theme.colors.primaryBlue[0]
                  : theme.colors.lightGray[0],
                transition: "background-color 0.3s, color 0.3s",
                "&:hover": {
                  backgroundColor: theme.colors.primaryBlue[0],
                  color: theme.colors.lightGray[0],
                },
              }}
            >
              <ActionIcon
                variant={isActive ? "filled" : "transparent"}
                color={isActive ? theme.colors.primaryBlue[0] : theme.colors.lightGray[0]}
                size="xl"
                style={{
                  color: hasActiveChild ? theme.colors.primaryBlue[0] : theme.colors.lightGray[0],
                  transition: "background-color 0.3s, color 0.3s",
                  borderRadius: "8px"
                }}
              >
                {item.icon}
              </ActionIcon>
              {item.children && (
                <Text size="xs">
                  {expandedItems[item.label]
                    ? createElement(icons.up)
                    : createElement(icons.down)}
                </Text>
              )}
            </Box>
          </Tooltip>
        ) : (
          <Box
            onClick={() => {
              if (item.children) toggleChildren(item.label);
              else handleNavigate(item.navigatePath);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "15px",
              margin: "5px 0",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor: isActive
                ? theme.colors.primaryBlue[0]
                : "transparent",
              color: isActive
                ? theme.colors.lightGray[0]
                : theme.colors.lightGray[0],
              transition: "background-color 0.3s, color 0.3s",
              "&:hover": {
                backgroundColor: theme.colors.primaryBlue[0],
                color: theme.colors.lightGray[0],
              },
            }}
          >
            {item.icon}
            {opened && <Text ml="sm">{item.label}</Text>}
            {item.children && (
              <Text size="xs" style={{ paddingLeft: "10px" }}>
                {expandedItems[item.label]
                  ? createElement(icons.up)
                  : createElement(icons.down)}
              </Text>
            )}
          </Box>
        )}
        {item.children && expandedItems[item.label] && (
          <>
            {item.children.map((child, childIndex) =>
              renderItem(child, childIndex)
            )}
          </>
        )}
      </Box>
    );
  };

  return (
    <Flex direction="column" style={{ alignItems: "center" }}>
      {mainItems.map((item, index) => renderItem(item, index))}
      <br />
      <br />
      <br />
      <Divider w="70px"/>
      {sessionItem.map((item, index) => renderItem(item, index))}
      <Divider />
    </Flex>
  );
}