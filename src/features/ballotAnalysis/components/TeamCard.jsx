import {
  Text,
  Card as MantineCard,
  Flex,
  Stack,
  Group,
  Badge,
  Button,
  Space,
} from "@mantine/core";
import { useState } from "react";
import Card from "../../../common/components/card/Card";
import RoundDetailModal from "./RoundDetailModal";
import PageSection from "../../../common/components/PageSection";
import AttorneyTable from "./AttorneyTable";
import WitnessTable from "./WitnessTable";

export default function TeamCard({
  team,
  tournamentTeamScores,
  tournamentName,
  ml,
}) {
  const [showDetails, setShowDetails] = useState(false);
  const teamScores = tournamentTeamScores.teamScores.find(
    (ts) => ts.teamId === team.id
  );

  const allScores = teamScores.scores.pAttorneyScores.concat(
    teamScores.scores.dAttorneyScores
  );

  return (
    <Card expandWhenHover={false}>
      <MantineCard.Section withBorder inheritPadding py="sm">
        <Flex justify="space-between" align="center">
          <Text
            fw={500}
            style={{ userSelect: "none", WebkitUserSelect: "none" }}
            flex={1}
          >
            {team.name}
          </Text>
          <Stack gap="xs" align="flex-end" w="fit-content" pl="sm">
            <Group
              gap="xs"
              style={{ userSelect: "none", WebkitUserSelect: "none" }}
            >
              <Text size="sm" c="dimmed">
                Rounds:
              </Text>
              <Badge
                fz="sm"
                color={
                  team.rounds.length == 0
                    ? "yellow"
                    : team.rounds.length > 3
                    ? "blue"
                    : "red"
                }
              >
                {team.rounds.length}
              </Badge>
            </Group>
            <Group
              gap="xs"
              style={{ userSelect: "none", WebkitUserSelect: "none" }}
            >
              <Text size="sm" c="dimmed">
                Ballots:
              </Text>
              <Badge
                fz="sm"
                color={
                  team.rounds.length == 0
                    ? "yellow"
                    : team.rounds.length * 2 >
                      team.rounds.reduce((sum, r) => sum + r.ballots, 0)
                    ? "red"
                    : "blue"
                }
              >
                {team.rounds.reduce((sum, r) => sum + r.ballots, 0)}
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
            onClick={() => {
              setShowDetails(!showDetails);
            }}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setShowRounds(!showRounds);
              }
            }}
          >
            {showDetails ? "Hide Details" : "Show Details"}
          </Text>
          {showDetails && (
            <>
              <Group gap="xs" mb="md" justify="center">
                {team.rounds.map((round) => (
                  <RoundDetailModal
                    key={`modal-${round.id}`}
                    tournamentName={tournamentName}
                    teamName={team.name}
                    round={round}
                    trigger={
                      <Button variant="filled" bdrs="md" size="sm">
                        Round {round.round_number}
                      </Button>
                    }
                  />
                ))}
              </Group>

              <PageSection
                title="attorneys"
                collapsible={true}
                defaultOpen={false}
              >
                <AttorneyTable allScores={allScores} />
              </PageSection>

              <Space h="xs" />

              <PageSection
                title="witnesses"
                collapsible={true}
                defaultOpen={false}
              >
                <WitnessTable allScores={allScores} />
              </PageSection>
            </>
          )}
        </Stack>
      </MantineCard.Section>
    </Card>
  );
}
