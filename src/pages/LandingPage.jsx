import { createElement } from "react";
import {
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  LuArrowRight,
  LuChartNoAxesCombined,
  LuClipboardList,
  LuMail,
  LuSchool,
  LuUsers,
} from "react-icons/lu";
import { Link } from "react-router-dom";
import { PiGavelFill } from "react-icons/pi";
import Logo from "../assets/svgs/Logo/Logo";
import GavelLoader from "../common/components/loader/GavelLoader";
import SupportLink, {
  SCHOOL_SETUP_HREF,
  SUPPORT_EMAIL,
  SUPPORT_HREF,
} from "../common/components/SupportLink";
import { useAuth } from "../context/AuthContext";

const sampleScores = [
  { role: "Attorneys", directAverage: 0.6, crossAverage: 0.2 },
  { role: "Witnesses", directAverage: 0.4, crossAverage: -0.1 },
];

const features = [
  {
    icon: LuClipboardList,
    title: "Keep tournaments organized",
    description: "Bring rounds, teams, and ballots together in one place.",
  },
  {
    icon: LuChartNoAxesCombined,
    title: "Turn ballots into insights",
    description:
      "Compare scores across tournaments and spot patterns in direct and cross examination.",
  },
  {
    icon: LuUsers,
    title: "Support the whole team",
    description:
      "Keep student and team records connected so coaches and captains can follow progress over time.",
  },
];

function ProductPreview() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const gridColor = isDark ? theme.colors.dark[4] : theme.colors.gray[3];
  const tickColor = isDark ? theme.colors.dark[1] : theme.colors.gray[7];

  return (
    <Paper
      withBorder
      radius="lg"
      p={{ base: "md", sm: "lg" }}
      shadow="xl"
      style={{
        position: "relative",
        overflow: "hidden",
        borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[3],
      }}
    >
      <Group justify="space-between" mb="md" wrap="nowrap">
        <Group gap="xs" wrap="nowrap">
          <Box w={38} h={32} aria-hidden="true">
            <GavelLoader
              scale={0.19}
              gavelColor={theme.colors.blue[7]}
              topPanelColor={theme.colors.cyan[5]}
              bottomPanelColor={theme.colors.blue[5]}
            />
          </Box>
          <Box>
            <Text size="xs" fw={700} tt="uppercase" c="dimmed">
              Ballot analysis
            </Text>
            <Text fw={700} size="lg">
              Performance trends
            </Text>
          </Box>
        </Group>
        <Badge variant="light" color="blue">
          Sample data
        </Badge>
      </Group>

      <Group gap="xs" mb="xs">
        <ThemeIcon size="sm" variant="light" color="blue">
          <PiGavelFill size={13} />
        </ThemeIcon>
        <Text size="sm" c="dimmed">
          Average score compared with the ballot
        </Text>
      </Group>

      <Box h={205} aria-label="Illustrative ballot analysis chart">
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          initialDimension={{ width: 440, height: 205 }}
        >
          <BarChart
            data={sampleScores}
            layout="vertical"
            margin={{ top: 8, right: 12, bottom: 8, left: 0 }}
            barGap={5}
          >
            <CartesianGrid
              stroke={gridColor}
              strokeDasharray="3 3"
              horizontal={false}
            />
            <ReferenceLine x={0} stroke={gridColor} strokeDasharray="4 4" />
            <XAxis
              type="number"
              domain={[-1, 1]}
              tickCount={5}
              stroke={gridColor}
              tick={{ fill: tickColor, fontSize: 11 }}
              tickFormatter={(value) => Number(value).toFixed(1)}
            />
            <YAxis
              type="category"
              dataKey="role"
              width={78}
              stroke={gridColor}
              tick={{ fill: tickColor, fontSize: 12 }}
            />
            <Tooltip
              formatter={(value, name) => [Number(value).toFixed(2), name]}
              contentStyle={{
                backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
                borderColor: gridColor,
                borderRadius: theme.radius.md,
              }}
            />
            <Legend wrapperStyle={{ color: tickColor, fontSize: 12 }} />
            <Bar
              dataKey="directAverage"
              name="Direct average"
              fill={theme.colors.blue[6]}
            />
            <Bar
              dataKey="crossAverage"
              name="Cross average"
              fill={theme.colors.cyan[6]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Group grow mt="md" align="stretch">
        <Card withBorder radius="md" p="sm">
          <Text size="xs" c="dimmed">
            Tournaments
          </Text>
          <Text fw={700}>Compare results</Text>
        </Card>
        <Card withBorder radius="md" p="sm">
          <Text size="xs" c="dimmed">
            Teams & students
          </Text>
          <Text fw={700}>Track progress</Text>
        </Card>
      </Group>
    </Paper>
  );
}

export default function LandingPage() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { user } = useAuth();
  const isDark = colorScheme === "dark";
  const pageSurface = isDark ? theme.colors.dark[8] : theme.colors.gray[0];
  const accountPath = user ? "/" : "/signup";
  const accountLabel = user ? "Go to your dashboard" : "Create your account";

  return (
    <Box
      style={{
        minHeight: "100vh",
        backgroundColor: pageSurface,
        color: "var(--mantine-color-text)",
      }}
    >
      {!user && (
        <Box
          component="header"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: isDark
              ? "rgba(26, 27, 30, 0.94)"
              : "rgba(255, 255, 255, 0.94)",
            borderBottom: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
            backdropFilter: "blur(12px)",
          }}
        >
          <Container size="xl" py="sm">
            <Group justify="space-between" wrap="nowrap">
              <Group gap="xs" wrap="nowrap">
                <Box w={38} h={38} aria-hidden="true">
                  <Logo scale={0.1} />
                </Box>
                <Text ff="Trirong" fw={600} size="lg">
                  MockMetrics
                </Text>
              </Group>

              <Group gap="lg" visibleFrom="md">
                <Anchor href="#platform" c="dimmed" underline="never">
                  Platform
                </Anchor>
                <Anchor href="#schools" c="dimmed" underline="never">
                  For schools
                </Anchor>
                <SupportLink c="dimmed" underline="never">
                  Support
                </SupportLink>
              </Group>

              <Group gap="xs" wrap="nowrap">
                <Button
                  component={Link}
                  to="/auth"
                  variant="subtle"
                  color="dark"
                  visibleFrom="xs"
                >
                  Sign in
                </Button>
                <Button component={Link} to={accountPath} size="sm">
                  Get started
                </Button>
              </Group>
            </Group>
          </Container>
        </Box>
      )}

      <Box
        component="main"
        style={{
          background: isDark
            ? `linear-gradient(180deg, ${theme.colors.dark[8]} 0%, ${theme.colors.dark[7]} 100%)`
            : `linear-gradient(180deg, ${theme.white} 0%, ${theme.colors.gray[0]} 100%)`,
        }}
      >
        <Container size="xl" py={{ base: 48, md: 80 }}>
          <Grid align="center" gutter={{ base: 40, md: 64 }}>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="lg">
                <Badge
                  variant="light"
                  color="blue"
                  size="lg"
                  leftSection={<PiGavelFill size={14} />}
                  w="fit-content"
                >
                  A better way to run mock trial
                </Badge>
                <Title
                  order={1}
                  fz={{ base: 42, sm: 54, lg: 64 }}
                  lh={1.08}
                  maw={650}
                  style={{ letterSpacing: "-0.04em" }}
                >
                  Make every round{" "}
                  <Text span inherit c="blue.6">
                    count.
                  </Text>
                </Title>
                <Text size="lg" c="dimmed" maw={550} lh={1.65}>
                  MockMetrics helps collegiate mock trial teams organize
                  tournaments, understand ballot results, and follow student and
                  team performance over time.
                </Text>
                <Group gap="sm" wrap="wrap">
                  <Button
                    component={Link}
                    to={accountPath}
                    size="md"
                    rightSection={<LuArrowRight size={17} />}
                  >
                    {accountLabel}
                  </Button>
                  <Button
                    component="a"
                    href={SCHOOL_SETUP_HREF}
                    variant="default"
                    size="md"
                    leftSection={<LuMail size={16} />}
                  >
                    Bring your school
                  </Button>
                </Group>
                <Text size="sm" c="dimmed">
                  New school?{" "}
                  <Anchor href={SCHOOL_SETUP_HREF}>
                    Contact our team to get it set up.
                  </Anchor>
                  <br /> Schools are added by our team.
                </Text>
                <Group gap="xs" c="dimmed" mt="xs">
                  <LuSchool size={16} />
                  <Text size="sm">
                    Built to help coaches and students work from the same
                    playbook.
                  </Text>
                </Group>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <ProductPreview />
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      <Container id="platform" size="xl" py={{ base: 56, md: 88 }}>
        <Stack gap="sm" ta="center" maw={760} mx="auto" mb="xl">
          <Text size="sm" fw={700} tt="uppercase" c="blue">
            The full picture, in one place
          </Text>
          <Title order={2} fz={{ base: 30, sm: 40 }}>
            Less time chasing details. More time building a stronger team.
          </Title>
          <Text c="dimmed" size="lg">
            Bring the everyday work of your program together, then use your
            results to make the next practice count.
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          {features.map(({ icon, title, description }) => (
            <Card key={title} withBorder radius="lg" p="lg" h="100%">
              <ThemeIcon size={48} radius="md" variant="light" color="blue">
                {createElement(icon, { size: 23 })}
              </ThemeIcon>
              <Title order={3} size="h4" mt="md">
                {title}
              </Title>
              <Text c="dimmed" mt="xs" lh={1.6}>
                {description}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      <Box
        id="schools"
        py={{ base: 52, md: 76 }}
        style={{
          backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
          borderBlock: `1px solid ${isDark ? theme.colors.dark[5] : theme.colors.gray[2]}`,
        }}
      >
        <Container size="xl">
          <Grid align="center" gutter={{ base: "xl", md: 64 }}>
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Stack gap="md">
                <Text size="sm" fw={700} tt="uppercase" c="blue">
                  Getting your school started
                </Text>
                <Title order={2} fz={{ base: 30, sm: 40 }}>
                  Your team belongs in the room.
                </Title>
                <Text c="dimmed" size="lg" lh={1.6}>
                  Create an account to get started. If your school isn&apos;t
                  part of MockMetrics yet, reach out to our support team first.
                  We handle every school addition on the backend to make sure
                  your program is set up correctly.
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Stack gap="sm">
                <Group align="flex-start" wrap="nowrap">
                  <ThemeIcon color="blue" variant="light" radius="xl">
                    <LuMail size={17} />
                  </ThemeIcon>
                  <Box>
                    <Text fw={600}>1. Get in touch</Text>
                    <Text size="sm" c="dimmed">
                      Email us at{" "}
                      <Anchor href={SCHOOL_SETUP_HREF}>{SUPPORT_EMAIL}</Anchor>{" "}
                      to request a school setup.
                    </Text>
                  </Box>
                </Group>
                <Group align="flex-start" wrap="nowrap">
                  <ThemeIcon color="blue" variant="light" radius="xl">
                    <LuSchool size={17} />
                  </ThemeIcon>
                  <Box>
                    <Text fw={600}>2. We set up your school</Text>
                    <Text size="sm" c="dimmed">
                      Our team adds the school and helps you get oriented.
                    </Text>
                  </Box>
                </Group>
                <Group align="flex-start" wrap="nowrap">
                  <ThemeIcon color="blue" variant="light" radius="xl">
                    <LuUsers size={17} />
                  </ThemeIcon>
                  <Box>
                    <Text fw={600}>3. Bring your team together</Text>
                    <Text size="sm" c="dimmed">
                      Invite your people and start organizing your season.
                    </Text>
                  </Box>
                </Group>
              </Stack>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      <Container size="xl" py={{ base: 56, md: 88 }}>
        <Paper
          radius="xl"
          p={{ base: "xl", md: 48 }}
          style={{
            color: theme.white,
            background: `linear-gradient(125deg, ${theme.colors.blue[9]}, ${theme.colors.blue[7]})`,
            overflow: "hidden",
          }}
        >
          <Grid align="center" gutter="xl">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Stack gap="xs">
                <Title order={2} fz={{ base: 30, sm: 40 }} c="white">
                  Ready for a more organized season?
                </Title>
                <Text c="blue.0" size="lg">
                  Start your account or talk with us about setting up your
                  school.
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap="sm">
                <Button
                  component={Link}
                  to={accountPath}
                  color="white"
                  c="blue.8"
                  size="md"
                  fullWidth
                  rightSection={<LuArrowRight size={17} />}
                >
                  {accountLabel}
                </Button>
                <Button
                  component="a"
                  href={SUPPORT_HREF}
                  variant="default"
                  size="md"
                  fullWidth
                >
                  Contact support
                </Button>
              </Stack>
            </Grid.Col>
          </Grid>
        </Paper>
      </Container>

      <Container size="xl" pb={{ base: 40, md: 64 }}>
        <Paper withBorder radius="lg" p={{ base: "md", sm: "lg" }}>
          <Group justify="space-between" align="center" gap="md" wrap="wrap">
            <Box>
              <Title order={3} size="h4">
                Privacy &amp; security
              </Title>
              <Text c="dimmed" size="sm" mt={4} maw={720}>
                We don&apos;t sell user or school data, and support staff don&apos;t
                routinely browse round or witness-selection records. Read how
                MockMetrics handles information and protects accounts.
              </Text>
            </Box>
            <Anchor component={Link} to="/privacy-and-security" fw={600}>
              Read our privacy &amp; security notice
            </Anchor>
          </Group>
        </Paper>
      </Container>
    </Box>
  );
}
