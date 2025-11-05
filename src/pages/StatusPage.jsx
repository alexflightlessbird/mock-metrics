import {
  Card,
  SimpleGrid,
  Group,
  Text,
  Badge,
  Stack,
  Divider,
  Anchor,
  Progress,
} from "@mantine/core";
import {
  LuExternalLink as IconExternalLink,
  LuScale as IconScale,
  LuBook as IconBooks,
  LuDatabase as IconDatabase,
} from "react-icons/lu";
import { PiGavelFill as IconGavel } from "react-icons/pi";
import BasePage from "../common/components/BasePage";
import PageSection from "../common/components/PageSection";

const services = [
  {
    name: "Case Management",
    description: "Mock trial case creation and management",
    icon: <IconGavel size={24} />,
    status: "operational",
    uptime: 99.98,
  },
  {
    name: "Scoring System",
    description: "Real-time ballot scoring and analysis",
    icon: <IconScale size={24} />,
    status: "operational",
    uptime: 99.95,
  },
  {
    name: "Evidence Repository",
    description: "Document storage and retrieval",
    icon: <IconBooks size={24} />,
    status: "degraded",
    uptime: 97.32,
    issues: "Increased latency for file uploads",
  },
  {
    name: "Database",
    description: "Primary data storage",
    icon: <IconDatabase size={24} />,
    status: "maintenance",
    uptime: 99.89,
    notice: "Scheduled maintenance every Thursday 2-4 AM EST",
  },
];

const statusColors = {
  operational: "green",
  degraded: "yellow",
  outage: "red",
  maintenance: "blue",
};

const incidents = [
  {
    title: "Evidence Upload Delays",
    status: "investigating",
    date: "2023-11-15",
    description:
      "We're currently investigating reports of slow evidence uploads.",
  },
  {
    title: "Scheduled Maintenance",
    status: "completed",
    date: "2023-11-10",
    description: "Completed database optimization maintenance window.",
  },
];

export default function StatusPage() {
  return (
    <BasePage titleText="Courtroom Status">
      <PageSection title="service status"></PageSection>
      <Stack gap="xl">
        <Text c="dimmed">
          Current operational status of MockMetrics services.{" "}
          <Anchor href="#" target="_blank">
            Subscribe to updates <IconExternalLink size={12} />
          </Anchor>
        </Text>

        {/* Summary Banner */}
        <Card withBorder>
          <Group justify="space-between">
            <Text fw={500}>All Systems</Text>
            <Badge color="green" size="lg">
              Operational
            </Badge>
          </Group>
          <Progress value={99.7} mt="sm" size="lg" color="green" />
          <Text fz="sm" c="dimmed" mt={4}>
            30-day uptime
          </Text>
        </Card>

        {/* Services Grid */}
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          {services.map((service) => (
            <Card withBorder key={service.name}>
              <Group justify="space-between">
                <Group gap="sm">
                  {service.icon}
                  <Stack gap={0}>
                    <Text fw={600}>{service.name}</Text>
                    <Text fz="sm" c="dimmed">
                      {service.description}
                    </Text>
                  </Stack>
                </Group>
                <Badge color={statusColors[service.status]}>
                  {service.status}
                </Badge>
              </Group>

              <Progress
                value={service.uptime}
                mt="md"
                size="sm"
                color={statusColors[service.status]}
              />
              <Group justify="space-between" mt={4}>
                <Text fz="sm" c="dimmed">
                  Uptime
                </Text>
                <Text fz="sm" fw={500}>
                  {service.uptime}%
                </Text>
              </Group>

              {service.issues && (
                <Text fz="sm" c="yellow" mt="sm">
                  ⚠️ {service.issues}
                </Text>
              )}

              {service.notice && (
                <Text fz="sm" c="blue" mt="sm">
                  ℹ️ {service.notice}
                </Text>
              )}
            </Card>
          ))}
        </SimpleGrid>

        <Divider my="xl" />

        <PageSection title="recent court orders">
          <Stack gap="xl">
            <Text c="dimmed">Service incidents and maintenance notices</Text>

            {incidents.map((incident) => (
              <Card withBorder key={incident.title}>
                <Group justify="space-between">
                  <Text fw={600}>{incident.title}</Text>
                  <Group>
                    <Text fz="sm" c="dimmed">
                      {incident.date}
                    </Text>
                    <Badge
                      color={
                        incident.status === "completed" ? "green" : "orange"
                      }
                      variant="light"
                    >
                      {incident.status}
                    </Badge>
                  </Group>
                </Group>
                <Text mt="sm">{incident.description}</Text>
              </Card>
            ))}
          </Stack>
        </PageSection>

        {/* Footer */}
        <Card withBorder mt="xl">
          <Text ta="center" c="dimmed">
            Last updated: {new Date().toLocaleString()} •{" "}
            <Anchor href="/history" underline="hover">
              View full case history
            </Anchor>
          </Text>
        </Card>
      </Stack>
    </BasePage>
  );
}
