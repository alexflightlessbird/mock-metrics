import { useState, useEffect, useMemo } from "react";
import {
  AppShell,
  NavLink,
  Burger,
  Group,
  rem,
  useMantineTheme,
  Text,
} from "@mantine/core";
import {
  useDisclosure,
  useViewportSize,
  useLocalStorage,
  useHeadroom,
} from "@mantine/hooks";
import { LuBriefcase, LuSchool, LuLogOut, LuDatabase } from "react-icons/lu";
import { PiGavelFill } from "react-icons/pi";
import { useNavigate, useLocation } from "react-router-dom";
import { emToPx } from "../common/utils/helpers";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/svgs/Logo";

const NAV_LINKS = [
  { icon: PiGavelFill, label: "Dashboard", path: "/" },
  { icon: LuBriefcase, label: "Cases", path: "/cases" },
  { icon: LuSchool, label: "School", path: "/school" },
];

export default function NavLayout({ children }) {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const pinned = useHeadroom({ fixedAt: 10 });

  const { signOut, isSuperAdmin, loading, superAdminLoading } = useAuth();

  const { width } = useViewportSize();
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] =
    useDisclosure();

  const [desktopCollapsed, setDesktopCollapsed] = useLocalStorage({
    key: "nav-collapsed",
    defaultValue: false,
  });

  const [sidebarWidth, setSidebarWidth] = useLocalStorage({
    key: "nav-width",
    defaultValue: 175,
  });

  const BOTTOM_LINKS = [
    {
      enabled: isSuperAdmin && !superAdminLoading,
      icon: LuDatabase,
      label: "Admin",
      path: "/admin",
      onClick: () => {
        navigate("/admin");
        setTimeout(() => {
          closeMobile();
        }, 100);
      },
    },
    {
      enabled: !loading,
      icon: LuLogOut,
      label: "Log Out",
      onClick: () => {
        signOut();
        navigate("/auth");
        setTimeout(() => {
          closeMobile();
        }, 100);
      },
    },
  ];

  const [isResizing, setIsResizing] = useState(false);

  const smBreakpointPx = useMemo(
    () => emToPx(parseFloat(theme.breakpoints.sm)),
    [theme.breakpoints.sm]
  );
  const isMobile = width < smBreakpointPx;

  // Reset mobile state when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      closeMobile();
    }
  }, [isMobile, closeMobile]);

  const startResizing = () => {
    setIsResizing(true);
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";
  };

  const stopResizing = () => {
    setIsResizing(false);
    document.body.style.userSelect = "";
    document.body.style.webkitUserSelect = "";
  };

  const resize = (e) => {
    if (isResizing && !isMobile) {
      const newWidth = e.clientX;
      // Always allow expanding from collapsed state
      if (desktopCollapsed && newWidth > 100) {
        setDesktopCollapsed(false);
        setSidebarWidth(Math.max(newWidth, 175));
      }
      // Normal resize when not collapsed
      else if (!desktopCollapsed) {
        if (newWidth < 100) {
          setDesktopCollapsed(true);
        } else if (newWidth >= 175 && newWidth < 400) {
          setSidebarWidth(newWidth);
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, desktopCollapsed]);

  return (
    <AppShell
      header={{ height: 70, collapsed: !pinned }}
      navbar={{
        width: isMobile
          ? mobileOpened
            ? sidebarWidth
            : 0
          : desktopCollapsed
          ? 80
          : sidebarWidth,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened },
      }}
      padding="md"
    >
      <AppShell.Header withBorder={false}>
        <Group h="100%" px="xs" justify={isMobile ? "center" : "flex-start"}>
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
            style={{ position: "absolute", left: "var(--mantine-spacing-md)" }}
          />
          <Group h="100%" gap="0">
            <Logo />
            <Text ff="Trirong" fz="xl">
              MockMetrics
            </Text>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar
        p="md"
        style={{
          overflow: "hidden",
          transition: "width 200ms ease",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
          }}
        >
          <AppShell.Section style={{ flex: 1 }}>
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                active={location.pathname === link.path}
                label={
                  isMobile ? link.label : desktopCollapsed ? null : link.label
                }
                leftSection={<link.icon size="1rem" />}
                onClick={() => {
                  navigate(link.path);
                  setTimeout(() => {
                    closeMobile();
                  }, 100);
                }}
                mb="xs"
              />
            ))}
          </AppShell.Section>

          <AppShell.Section mb="xs">
            {BOTTOM_LINKS.map((link) => {
              return (
                link.enabled && (
                  <NavLink
                    key={link.label}
                    active={location.pathname === link?.path}
                    label={
                      isMobile
                        ? link.label
                        : desktopCollapsed
                        ? null
                        : link.label
                    }
                    leftSection={<link.icon size="1rem" />}
                    onClick={() => link.onClick()}
                  />
                )
              );
            })}
          </AppShell.Section>

          {!isMobile && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: rem(4),
                cursor: "col-resize",
                zIndex: 1000,
              }}
              onMouseDown={startResizing}
            />
          )}
        </div>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
