import { useState } from "react";
import Card from "../../../common/components/card/Card";
import {
  Badge,
  Flex,
  Group,
  Card as MantineCard,
  Space,
  Stack,
  Text,
} from "@mantine/core";
import PageSection from "../../../common/components/PageSection";
import ScoreTable from "./ScoreTable";

export default function TournamentSummaryCard({
  tournament,
  allTeamScores,
  children,
}) {
  const [expanded, setExpanded] = useState(false);
  const teamCount = tournament.teams.length;
  const totalRounds = tournament.teams.reduce(
    (sum, team) => sum + team.rounds.length,
    0
  );
  const totalBallots = tournament.teams.reduce((sum, team) => {
    const teamBallots = team.rounds.reduce(
      (roundSum, round) => roundSum + round.ballots,
      0
    );
    return sum + teamBallots;
  }, 0);

  const attorneyScores = allTeamScores[0].calculations.attorneys;
  const witnessScores = allTeamScores[0].calculations.witnesses;

  return (
    <Card>
      <MantineCard.Section withBorder inheritPadding py="sm">
        <Flex justify="space-between" align="center">
          <Text
            fw={500}
            style={{ userSelect: "none", WebkitUserSelect: "none" }}
            flex={1}
          >
            {tournament.name} - {tournament.year} ({teamCount} teams)
          </Text>
          <Stack gap="xs" align="flex-end" w="fit-content" pl="sm">
            <Group
              gap="xs"
              style={{ userSelect: "none", WebkitUserSelect: "none" }}
            >
              <Text size="sm" c="dimmed">
                Rounds:
              </Text>
              <Badge fz="sm" color="blue">
                {totalRounds}
              </Badge>
            </Group>
            <Group
              gap="xs"
              style={{ userSelect: "none", WebkitUserSelect: "none" }}
            >
              <Text size="sm" c="dimmed">
                Ballots:
              </Text>
              <Badge fz="sm" color="blue">
                {totalBallots}
              </Badge>
            </Group>
          </Stack>
        </Flex>
      </MantineCard.Section>

      <MantineCard.Section inheritPadding py="sm">
        <Stack gap="xs">
          <Text
            span
            style={{
              cursor: "pointer",
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
            c="blue"
            onClick={() => setExpanded(!expanded)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setExpanded(!expanded);
              }
            }}
          >
            {expanded ? "Hide Details" : "Show Details"}
          </Text>
          {expanded && (
            <>
              <PageSection
                title="attorneys"
                collapsible={true}
                defaultOpen={false}
              >
                <ScoreTable type="attorney" allScores={attorneyScores} />
              </PageSection>

              <Space h="xs" />

              <PageSection
                title="witnesses"
                collapsible={true}
                defaultOpen={false}
              >
                <ScoreTable type="witness" allScores={witnessScores} />
              </PageSection>

              <Space h="xs" />

              <MantineCard.Section inheritPadding py="sm">
                <PageSection
                  title="team breakdowns"
                  collapsible={true}
                  defaultOpen={false}
                >
                  <Flex direction="column" gap="md" justify="center">
                    {children}
                  </Flex>
                </PageSection>
              </MantineCard.Section>

              <Space h="xs" />
            </>
          )}
        </Stack>
      </MantineCard.Section>
    </Card>
  );
}
