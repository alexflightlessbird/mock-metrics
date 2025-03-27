import React, { useState } from "react";
import {
  Tooltip,
  Flex,
  Box,
  Text,
  useMantineTheme,
  Divider,
} from "@mantine/core";
import { useNavigate, useLocation } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
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
          label: "Schools",
          icon: React.createElement(icons.school),
          navigatePath: "/schools",
        },
      ],
    },
  ];

  const sessionItem = session
    ? [
        {
          label: "Logout",
          icon: React.createElement(icons.logout),
          navigatePath: "/auth",
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
        },
      ];

  const mainItems = session
    ? commonItems.concat(loggedInItems)
    : commonItems.concat(loggedOutItems);

  const handleNavigate = (path) => {
    if (opened) toggle(); // Close the sidebar if it's in the mobile view
    navigate(path);
  };

  const toggleChildren = (label) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isChildActive = (children) => {
    return children?.some((child) => location.pathname === child.navigatePath);
  };

  const renderItem = (item, index) => {
    const isActive = location.pathname === item.navigatePath;
    const hasActiveChild = isChildActive(item.children);

    return (
      <Box key={index}>
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
                padding: "15px",
                margin: "5px 0",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: isActive
                  ? theme.colors.primaryBlue[0]
                  : "transparent",
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
              {item.icon}
              {item.children && (
                <Text size="xs" style={{ paddingLeft: "5px" }}>
                  {expandedItems[item.label]
                    ? React.createElement(icons.up)
                    : React.createElement(icons.down)}
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
                  ? React.createElement(icons.up)
                  : React.createElement(icons.down)}
              </Text>
            )}
          </Box>
        )}
        {item.children && expandedItems[item.label] && (
          <Box pl="md">
            {item.children.map((child, childIndex) =>
              renderItem(child, childIndex)
            )}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Flex direction="column" p="xs">
      {mainItems.map((item, index) => renderItem(item, index))}
      <br />
      <br />
      <br />
      <Divider />
      {sessionItem.map((item, index) => renderItem(item, index))}
      <Divider />
    </Flex>
  );
}