import { useState, useEffect } from "react";
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
  useMantineColorScheme,
  Tooltip,
} from "@mantine/core";
import { useDisclosure, useLocalStorage, useHeadroom } from "@mantine/hooks";
import {
  LuBriefcase,
  LuSchool,
  LuLogOut,
  LuDatabase,
  LuChevronsUpDown as ChevronIcon,
  LuLayoutDashboard,
  LuSettings,
} from "react-icons/lu";
import { PiGavelFill } from "react-icons/pi";
import { TbTournament } from "react-icons/tb";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/svgs/Logo/Logo";
import { useUserAssignments } from "../common/hooks/useUserAssignments";
import CookieBanner from "../common/components/CookieBanner";
import { useMobile } from "../context/MobileContext";

const NAV_LINKS = [
  { icon: PiGavelFill, label: "Dashboard", path: "/", showOnNoSchool: true },
  {
    icon: LuBriefcase,
    label: "Cases",
    path: "/cases",
    showOnNoSchool: true,
    matchPattern: /^\/cases(\/[^/]+)?$/,
  },
  { icon: LuSchool, label: "School", path: "/school", showOnNoSchool: false },
  {
    icon: TbTournament,
    label: "Tournaments",
    path: "/tournaments",
    showOnNoSchool: false,
    matchPattern: /^\/tournaments(\/[^/]+)?$/,
  },
];

const NavLinkWithTooltip = ({ isMobile, desktopCollapsed, ...props }) => {
  if (isMobile || !desktopCollapsed) {
    return <NavLink bdrs="md" {...props} />;
  }

  return (
    <Tooltip label={props.label} position="right" withArrow>
      <NavLink bdrs="md" {...props} label={null} />
    </Tooltip>
  );
};

export default function NavLayout({ children }) {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const pinned = useHeadroom({ fixedAt: 120, behavior: "transform" });
  const { colorScheme } = useMantineColorScheme();

  const { user, signOut, isSuperAdmin, loading, superAdminLoading } = useAuth();

  const { assignments, isLoading } = useUserAssignments(user.id);

  const [selectedSchoolId, setSelectedSchoolId] = useLocalStorage({
    key: "school",
    defaultValue: null,
  });

  useEffect(() => {
    if (
      assignments?.length === 1 &&
      assignments[0]?.school_id !== selectedSchoolId
    )
      setSelectedSchoolId(assignments[0]?.school_id);
  }, [assignments]);

  useEffect(() => {
    if (isLoading) return;
    if (
      selectedSchoolId &&
      !assignments.find((a) => a.school_id === selectedSchoolId)
    ) {
      setSelectedSchoolId(null);
    }
  }, [assignments, selectedSchoolId, setSelectedSchoolId]);

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
      enabled: !loading,
      icon: LuSettings,
      label: "Settings",
      path: "/settings",
      onClick: () => {
        navigate("/settings");
        setTimeout(() => {
          closeMobile();
        }, 100);
      },
    },
    {
      enabled: !loading && isSuperAdmin && !superAdminLoading,
      icon: LuLayoutDashboard,
      label: "Admin Test",
      path: "/admin-test",
      onClick: () => {
        navigate("/admin-test");
        setTimeout(() => {
          closeMobile();
        }, 100);
      },
    },
    {
      enabled: !loading && isSuperAdmin && !superAdminLoading,
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

  const { isMobile } = useMobile();

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
        <Group h="100%" px="xs" justify={isMobile ? "center" : "left"}>
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
            style={{ position: "absolute", left: "var(--mantine-spacing-md)" }}
          />
          <Group
            h="100%"
            gap="0"
            tabIndex="0"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.currentTarget.click();
              }
            }}
            style={{
              userSelect: "none",
              WebkitUserSelect: "none",
              cursor: "pointer",
            }}
            onClick={() => {
              navigate("/");
              closeMobile();
            }}
          >
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
          transition: isResizing ? "width 200ms ease" : "none",
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
              <Menu
                withinPortal
                position="bottom-start"
                width={
                  isMobile ? `calc(100vw - (${theme.spacing.xs} * 3))` : 200
                }
                disabled={assignments.length === 1}
              >
                <Menu.Target>
                  <Flex
                    bg={
                      colorScheme === "dark"
                        ? theme.colors.dark[5]
                        : theme.colors.gray[1]
                    }
                    bdrs="md"
                    pl="xs"
                    pr="xs"
                    pt="xs"
                    pb="xs"
                    style={{
                      overflow: "hidden",
                      cursor: assignments.length > 1 ? "pointer" : "default",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    tabIndex={
                      isMobile && !mobileOpened
                        ? -1
                        : assignments.length > 1
                        ? 0
                        : ""
                    }
                    onKeyDown={(e) => {
                      if (
                        assignments.length > 1 &&
                        (e.key === "Enter" || e.key === " ")
                      ) {
                        e.preventDefault();
                        e.currentTarget.click();
                      }
                    }}
                  >
                    <Text truncate size={isMobile ? "md" : "xs"}>
                      {desktopCollapsed && !isMobile
                        ? assignments.find(
                            (a) => a.school_id === selectedSchoolId
                          )?.schools.short_name
                        : assignments.find(
                            (a) => a.school_id === selectedSchoolId
                          )?.schools.name}
                    </Text>
                    {assignments.length > 1 &&
                      !(desktopCollapsed && !isMobile) && <ChevronIcon />}
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
            )}
          </AppShell.Section>

          <AppShell.Section style={{ flex: 1 }}>
            {NAV_LINKS.map((link) => (
              <NavLinkWithTooltip
                isMobile={isMobile}
                desktopCollapsed={desktopCollapsed}
                key={link.path}
                disabled={!link.showOnNoSchool && !selectedSchoolId}
                active={
                  link.matchPattern
                    ? link.matchPattern.test(location.pathname)
                    : location.pathname === link.path
                }
                label={link.label}
                leftSection={<link.icon size="1rem" />}
                onClick={(e) => {
                  e.preventDefault();
                  if (!link.showOnNoSchool && !selectedSchoolId) return;
                  navigate(link.path);
                  setTimeout(() => {
                    closeMobile();
                  }, 100);
                }}
                mb="xs"
                tabIndex={
                  (isMobile && !mobileOpened) ||
                  (!link.showOnNoSchool && !selectedSchoolId)
                    ? -1
                    : 0
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.currentTarget.click();
                    closeMobile();
                  }
                }}
                styles={{
                  root: {
                    cursor: "pointer",
                  },
                }}
              />
            ))}
          </AppShell.Section>

          <AppShell.Section mb="xs">
            {BOTTOM_LINKS.map((link) => {
              return (
                link.enabled && (
                  <NavLinkWithTooltip
                    isMobile={isMobile}
                    desktopCollapsed={desktopCollapsed}
                    key={link.label}
                    active={location.pathname === link?.path}
                    label={link.label}
                    leftSection={<link.icon size="1rem" />}
                    tabIndex={isMobile && !mobileOpened ? -1 : 0}
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

      <AppShell.Main
        mih="calc(100vh - var(--app-shell-header-height))"
        pb="xl"
        pt={`calc(${rem(70)} + var(--mantine-spacing-md))`}
      >
        {children}
        <CookieBanner />
      </AppShell.Main>
    </AppShell>
  );
}
