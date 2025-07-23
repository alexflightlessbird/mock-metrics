import { useState, useEffect, useMemo } from "react";
import {
  AppShell,
  NavLink,
  Burger,
  Group,
  rem,
  useMantineTheme,
  Text,
  Flex,
  Menu,
} from "@mantine/core";
import {
  useDisclosure,
  useViewportSize,
  useLocalStorage,
  useHeadroom,
} from "@mantine/hooks";
import { LuBriefcase, LuSchool, LuLogOut, LuDatabase, LuChevronsUpDown as ChevronIcon, LuLayoutDashboard } from "react-icons/lu";
import { PiGavelFill } from "react-icons/pi";
import { useNavigate, useLocation } from "react-router-dom";
import { emToPx } from "../common/utils/helpers";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/svgs/Logo";
import { useUserAssignments } from "../features/dashboard/hooks/useUserAssignments";
import CookieBanner from "../common/components/CookieBanner";

const NAV_LINKS = [
  { icon: PiGavelFill, label: "Dashboard", path: "/" },
  { icon: LuBriefcase, label: "Cases", path: "/cases" },
  { icon: LuSchool, label: "School", path: "/school" },
];

export default function NavLayout({ children }) {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const pinned = useHeadroom({ fixedAt: 120, behavior: "transform" });

  const { user, signOut, isSuperAdmin, loading, superAdminLoading } = useAuth();

  const { assignments, isLoading } = useUserAssignments(user.id);

  const [selectedSchoolId, setSelectedSchoolId] = useLocalStorage({
    key: "school",
    defaultValue: null
  });

  useEffect(() => {
    if (
      assignments?.length === 1 &&
      assignments[0]?.school_id !== selectedSchoolId
    )
      setSelectedSchoolId(assignments[0]?.school_id);
  }, [assignments]);

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
      icon: LuLayoutDashboard,
      label: "Admin Test",
      path: "/admin-test",
      onClick: () => {
        navigate("/admin-test");
        setTimeout(() => {
          closeMobile();
        }, 100);
      }
    },
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
    document.body.style.WebkitUserSelect = "none";
  };

  const stopResizing = () => {
    setIsResizing(false);
    document.body.style.userSelect = "";
    document.body.style.WebkitUserSelect = "";
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

  if (isLoading) return <></>;

  return (
    <AppShell
      header={{ height: 70, collapsed: !pinned, offset: false }}
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
      <AppShell.Header withBorder={false} zIndex={1000}>
        <Group h="100%" px="xs" justify={isMobile ? "center" : "flex-start"}>
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
            style={{ position: "absolute", left: "var(--mantine-spacing-md)" }}
          />
          <Group h="100%" gap="0" tabIndex="0" onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.currentTarget.click(); } }} style={{ userSelect: "none", WebkitUserSelect: "none", cursor: "pointer" }} onClick={() => navigate("/")}>
            <Logo />
            <Text ff="Trirong" fz="xl">
              MockMetrics
            </Text>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar
        pt={pinned ? `calc(${rem(70)} + var(--mantine-spacing-md))` : "md"}
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
          <AppShell.Section mb="lg">
            {assignments.length > 0 && (
              <>
                {!(desktopCollapsed && !isMobile) && <Text size={isMobile ? "md" : "sm"} mb="2">Current School:</Text>}
                <Menu
                  withinPortal
                  position="bottom-start"
                  width={isMobile ? `calc(100vw - (${theme.spacing.xs} * 3))` : 200}
                  disabled={assignments.length === 1}
                >
                  <Menu.Target>
                    <Flex
                      bg={theme.colors.gray[1]}
                      pl="xs"
                      pr="xs"
                      pt="xs"
                      pb="xs"
                      bdrs={`calc(${theme.spacing.xs} - 2px)`}
                      style={{
                        overflow: "hidden",
                        cursor: assignments.length > 1 ? "pointer" : "default",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                      tabIndex={assignments.length > 1 ? 0 : ""}
                      onKeyDown={(e) => {
                        if (assignments.length > 1 && (e.key === "Enter" || e.key === " ")) {
                          e.preventDefault();
                          e.currentTarget.click();
                        }
                      }}
                    >
                      <Text truncate size={isMobile ? "md" : "xs"}>
                        {desktopCollapsed && !isMobile
                          ? assignments.find(a => a.school_id === selectedSchoolId)?.schools.short_name
                          : assignments.find(a => a.school_id === selectedSchoolId)?.schools.name
                        }
                      </Text>
                      {assignments.length > 1 && !(desktopCollapsed && !isMobile) && (
                        <ChevronIcon />
                      )}
                    </Flex>
                  </Menu.Target>

                  {assignments.length > 1 && (
                    <Menu.Dropdown>
                      {assignments.map((a) => (
                        <Menu.Item
                          key={a.school_id}
                          onClick={() => setSelectedSchoolId(a.school_id)}
                        >
                          {a.schools.name} ({a.schools.short_name})
                        </Menu.Item>
                      ))}
                    </Menu.Dropdown>
                  )}
                </Menu>
              </>
            )}
          </AppShell.Section>
          <AppShell.Section style={{ flex: 1 }}>
            {NAV_LINKS.map((link) => (
              <NavLink
                disabled={link.label.toLowerCase() === "school" && !selectedSchoolId}
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
                tabIndex={link.label.toLowerCase() === "school" && !selectedSchoolId ? "" : 0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.currentTarget.click();
                    closeMobile();
                  }
                }}
                style={{
                  cursor: link.label.toLowerCase() === "school" && !selectedSchoolId ? "not-allowed" : undefined
                }}
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
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.currentTarget.click();
                        closeMobile();
                      }
                    }}
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

      <AppShell.Main mih="calc(100vh - var(--app-shell-header-height))" pb="xl" pt={`calc(${rem(70)} + var(--mantine-spacing-md))`}>
        {children}
        <CookieBanner />
      </AppShell.Main>
    </AppShell>
  );
}
