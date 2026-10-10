import { useState } from "react";
import {
  Accordion,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  NumberInput,
  SimpleGrid,
  Stack,
  Table,
  Text,
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
  LuArrowDownRight,
  LuArrowLeftRight,
  LuArrowUpRight,
} from "react-icons/lu";
import PageSection from "../../../common/components/PageSection";
import {
  DEFAULT_INSIGHT_THRESHOLDS,
  generateAnalysisInsights,
} from "../utils/analysisInsights";
import { calculateAnalysisTrends } from "../utils/analysisTrends";

const formatMean = (value) =>
  value === null || value === undefined ? "—" : Number(value).toFixed(2);

const formatDifference = (value) => {
  if (value === null || value === undefined) return "—";
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(2)}`;
};

function ThresholdInput({ label, value, onChange, min = 1, max, step = 1 }) {
  return (
    <NumberInput
      label={label}
      value={value}
      onChange={(nextValue) => {
        const numericValue = Number(nextValue);
        if (Number.isFinite(numericValue)) onChange(numericValue);
      }}
      min={min}
      max={max}
      step={step}
      decimalScale={step < 1 ? 2 : 0}
      size="sm"
    />
  );
}

function InsightDirection({ insight }) {
  if (insight.direction === "range") {
    return (
      <Group gap="xs">
        <Badge color="teal" variant="light" leftSection={<LuArrowUpRight />}>
          Highest: {insight.aboveLabel}
        </Badge>
        <Badge color="orange" variant="light" leftSection={<LuArrowDownRight />}>
          Lowest: {insight.belowLabel}
        </Badge>
      </Group>
    );
  }

  if (insight.direction === "above" || insight.direction === "below") {
    const isAbove = insight.direction === "above";
    const Icon = isAbove ? LuArrowUpRight : LuArrowDownRight;

    return (
      <Badge
        color={isAbove ? "teal" : "orange"}
        variant="light"
        leftSection={<Icon />}
      >
        {insight.subject} {isAbove ? "above" : "below"} {insight.comparison}
      </Badge>
    );
  }

  return (
    <Badge color="gray" variant="light" leftSection={<LuArrowLeftRight />}>
      No clear above/below pattern
    </Badge>
  );
}

function InsightCard({ insight }) {
  const accentColor =
    insight.direction === "above"
      ? "var(--mantine-color-teal-6)"
      : insight.direction === "below"
        ? "var(--mantine-color-orange-6)"
        : "var(--mantine-color-gray-5)";

  return (
    <Card
      withBorder
      radius="md"
      p="sm"
      style={{ borderLeft: `4px solid ${accentColor}` }}
    >
      <Stack gap={6}>
        <Group justify="space-between" align="center" wrap="wrap">
          <Text fw={600}>{insight.title}</Text>
          <InsightDirection insight={insight} />
        </Group>
        <Text size="sm">{insight.body}</Text>
        <Text size="xs" c="dimmed">
          See: {insight.chart}
        </Text>
      </Stack>
    </Card>
  );
}

function getChartRows(rows) {
  return rows.map((row) => ({
    label: row.chartLabel || row.label,
    directAverage: row.directAverage,
    directCount: row.directCount,
    crossAverage: row.crossAverage,
    crossCount: row.crossCount,
  }));
}

function combineTypeRows(overallRows, sideRows) {
  const types = new Set([
    ...overallRows.map((row) => row.type),
    ...sideRows.map((row) => row.type),
  ]);
  const sideOrder = { Plaintiff: 0, Prosecution: 1, Defense: 2 };

  return Array.from(types)
    .sort((a, b) => a.localeCompare(b))
    .flatMap((type) => {
      const overall = overallRows.find((row) => row.type === type);
      const breakdowns = sideRows
        .filter((row) => row.type === type)
        .sort(
          (a, b) =>
            (sideOrder[a.side] ?? 3) - (sideOrder[b.side] ?? 3),
        );

      return [
        ...(overall
          ? [
              {
                ...overall,
                groupLabel: type,
                chartLabel: `${type} · all`,
                side: "All sides",
              },
            ]
          : []),
        ...breakdowns.map((row) => ({
          ...row,
          groupLabel: type,
          chartLabel: `${type} · ${
            row.side === "Plaintiff"
              ? "Pl"
              : row.side === "Prosecution"
                ? "Pr"
                : row.side === "Defense"
                  ? "D"
                  : row.side
          }`,
        })),
      ];
    });
}

function getSharedScoreDomain(trends) {
  const groups = [
    trends.attorneyBySide,
    trends.attorneyByWitness,
    trends.attorneyByWitnessType,
    trends.attorneyByWitnessTypeAndSide,
    trends.witnessBySide,
    trends.witnessByType,
    trends.witnessByTypeAndSide,
    trends.witnessByCharacter,
  ];
  const scores = groups
    .flatMap((rows) =>
      rows.flatMap((row) => [row.directAverage, row.crossAverage]),
    )
    .filter((score) => Number.isFinite(score));

  if (!scores.length) return [-1, 1];

  const minimum = Math.min(0, ...scores);
  const maximum = Math.max(0, ...scores);
  const padding = (maximum - minimum) * 0.05 || 1;
  return [minimum - padding, maximum + padding];
}

function rankByHighestAverage(a, b) {
  const aHighest = Math.max(
    a.directAverage ?? -Infinity,
    a.crossAverage ?? -Infinity,
  );
  const bHighest = Math.max(
    b.directAverage ?? -Infinity,
    b.crossAverage ?? -Infinity,
  );

  return bHighest - aHighest || a.label.localeCompare(b.label);
}

function TrendChart({
  data,
  domain = [-1, 1],
  showDirect = true,
  showCross = true,
  height = 280,
}) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const gridColor = isDark ? theme.colors.dark[4] : theme.colors.gray[3];
  const tickColor = isDark ? theme.colors.dark[1] : theme.colors.gray[7];

  if (!data.length) return null;

  return (
    <Card withBorder radius="md" p="xs" style={{ minWidth: 0 }}>
      <ResponsiveContainer
        width="100%"
        height={height}
        minWidth={0}
        initialDimension={{ width: 800, height }}
      >
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 24, bottom: 8, left: 8 }}
          barGap={4}
        >
          <CartesianGrid
            stroke={gridColor}
            strokeDasharray="3 3"
            horizontal={false}
          />
          <ReferenceLine x={0} stroke={gridColor} strokeDasharray="4 4" />
          <XAxis
            type="number"
            domain={domain}
            tickCount={5}
            stroke={gridColor}
            tick={{ fill: tickColor, fontSize: 12 }}
            tickFormatter={(value) => Number(value).toFixed(1)}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={170}
            stroke={gridColor}
            tick={{ fill: tickColor, fontSize: 12 }}
            tickFormatter={(value) =>
              value.length > 27 ? `${value.slice(0, 25)}…` : value
            }
          />
          <Tooltip
            formatter={(value, name, item) => {
              const countKey =
                item?.dataKey === "directAverage"
                  ? "directCount"
                  : "crossCount";
              const count = item?.payload?.[countKey] ?? 0;
              return [`${Number(value).toFixed(2)} (n=${count})`, name];
            }}
            contentStyle={{
              backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
              borderColor: gridColor,
              borderRadius: theme.radius.md,
              color: isDark ? theme.colors.dark[0] : theme.black,
            }}
            labelStyle={{ color: isDark ? theme.colors.dark[0] : theme.black }}
            itemStyle={{ color: isDark ? theme.colors.dark[0] : theme.black }}
          />
          {(showDirect || showCross) && (
            <Legend wrapperStyle={{ color: tickColor }} />
          )}
          {showDirect && (
            <Bar
              dataKey="directAverage"
              name="Direct average"
              fill={theme.colors.blue[6]}
            />
          )}
          {showCross && (
            <Bar
              dataKey="crossAverage"
              name="Cross average"
              fill={theme.colors.cyan[6]}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

function RoundedTable({ children, minWidth = 560 }) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Card withBorder radius="md" p={0} style={{ overflow: "hidden" }}>
      <Box style={{ overflowX: "auto" }}>
        <Table
          striped="even"
          stripedColor={isDark ? "dark.7" : undefined}
          highlightOnHover
          withRowBorders
          miw={minWidth}
          fz="xs"
        >
          {children}
        </Table>
      </Box>
    </Card>
  );
}

function GroupedScoresTable({
  rows,
  firstColumnTitle = "Group",
  showType = false,
  showSide = false,
  sideTitle = "Side",
}) {
  return (
    <RoundedTable>
      <Table.Caption>
        Averages are adjusted scores; n is the count of score observations.
      </Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>{firstColumnTitle}</Table.Th>
          {showType && <Table.Th>Type</Table.Th>}
          {showSide && <Table.Th>{sideTitle}</Table.Th>}
          <Table.Th>Direct avg</Table.Th>
          <Table.Th>Direct n</Table.Th>
          <Table.Th>Cross avg</Table.Th>
          <Table.Th>Cross n</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {rows.map((row) => (
          <Table.Tr key={row.id || `${row.label}-${row.side || ""}`}>
            <Table.Td>{row.groupLabel || row.label}</Table.Td>
            {showType && <Table.Td>{row.type}</Table.Td>}
            {showSide && <Table.Td>{row.side}</Table.Td>}
            <Table.Td>{formatMean(row.directAverage)}</Table.Td>
            <Table.Td>{row.directCount}</Table.Td>
            <Table.Td>{formatMean(row.crossAverage)}</Table.Td>
            <Table.Td>{row.crossCount}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </RoundedTable>
  );
}

function SideComparison({ rows, domain }) {
  const orderedRows = [...rows].sort((a, b) => {
    const sideOrder = {
      Plaintiff: 0,
      Prosecution: 0,
      Defense: 1,
      Swing: 2,
    };
    return (sideOrder[a.label] ?? 2) - (sideOrder[b.label] ?? 2);
  });
  const pSideRows = orderedRows.filter((row) =>
    ["Plaintiff", "Prosecution"].includes(row.label),
  );
  const pSide = pSideRows.length === 1 ? pSideRows[0] : null;
  const defense = orderedRows.find((row) => row.label === "Defense");
  const directDifference =
    pSide?.directAverage !== null &&
    pSide?.directAverage !== undefined &&
    defense?.directAverage !== null &&
    defense?.directAverage !== undefined
      ? defense.directAverage - pSide.directAverage
      : null;
  const crossDifference =
    pSide?.crossAverage !== null &&
    pSide?.crossAverage !== undefined &&
    defense?.crossAverage !== null &&
    defense?.crossAverage !== undefined
      ? defense.crossAverage - pSide.crossAverage
      : null;

  return (
    <Stack gap="xs">
      <Text size="sm" c="dimmed">
        {pSide && defense ? (
          <>
            Defense minus {pSide.label}: direct {formatDifference(directDifference)};
            cross {formatDifference(crossDifference)}. Positive values indicate
            a higher Defense average in this selected data.
          </>
        ) : pSideRows.length > 1 ? (
          "Both Plaintiff and Prosecution case data are selected; read their rows separately rather than combining them into one side comparison."
        ) : (
          "Compare the side averages directly; swing and unknown-side observations are shown separately when present."
        )}
      </Text>
      <TrendChart
        data={getChartRows(orderedRows)}
        domain={domain}
      />
      <GroupedScoresTable rows={orderedRows} />
    </Stack>
  );
}

export default function AnalysisTrendsSection({ attorneys, witnesses }) {
  const [trends, setTrends] = useState(null);
  const [thresholds, setThresholds] = useState(DEFAULT_INSIGHT_THRESHOLDS);

  const updateThreshold = (key, value) => {
    setThresholds((current) => ({ ...current, [key]: value }));
  };

  const resetThresholds = () => {
    setThresholds({ ...DEFAULT_INSIGHT_THRESHOLDS });
  };

  const generateTrends = () => {
    setTrends(calculateAnalysisTrends({ attorneys, witnesses }));
  };
  const scoreDomain = trends ? getSharedScoreDomain(trends) : [-1, 1];
  const insights = trends
    ? generateAnalysisInsights({ attorneys, witnesses, trends, thresholds })
    : [];

  const attorneyTypeSideRows = trends
    ? combineTypeRows(
        trends.attorneyByWitnessType,
        trends.attorneyByWitnessTypeAndSide,
      )
    : [];
  const witnessTypeSideRows = trends
    ? combineTypeRows(trends.witnessByType, trends.witnessByTypeAndSide)
    : [];
  const topAttorneyWitnesses = trends?.attorneyByWitness
    .filter(
      (row) => row.directAverage !== null || row.crossAverage !== null,
    )
    .sort(rankByHighestAverage)
    .slice(0, 10);
  const topWitnessCharacters = trends?.witnessByCharacter
    .filter(
      (row) => row.directAverage !== null || row.crossAverage !== null,
    )
    .sort(rankByHighestAverage)
    .slice(0, 10);

  return (
    <PageSection title="analysis trends" collapsible defaultOpen={false}>
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Compare adjusted direct and cross results. Positive values are above
          the ballot baseline; negative values are below. These are patterns to
          review, not rules about performance. Swing witnesses may appear on
          either trial side; “Swing” describes the character, not the scored
          team side.
        </Text>
        <Text size="xs" c="dimmed">
          Blue = direct · cyan = cross · same scale · hover for average and n.
          Side charts use the performing team’s side; individual character
          tables show the character’s listed side.
        </Text>
        {!trends ? (
          <Group>
            <Button onClick={generateTrends}>Generate trends</Button>
          </Group>
        ) : (
          <>
            <Group>
              <Button variant="light" onClick={generateTrends}>
                Refresh trends
              </Button>
            </Group>

            <Stack gap="sm">
              <Title order={3}>What the results may be telling you</Title>
              <Alert color="yellow" title="Use these as prompts, not rules">
                Data-based suggestions only. Assignment, team, tournament, and
                judging context may contribute; check the rounds before using a
                pattern to evaluate a student.
              </Alert>
              <Text size="sm" c="dimmed">
                Each note includes its average and sample count (n). The named
                chart or table shows the supporting groups.
              </Text>
              {insights.map((insight, index) => (
                <InsightCard
                  key={`${insight.title}-${index}`}
                  insight={insight}
                />
              ))}
              <Accordion variant="contained" radius="md">
                <Accordion.Item value="methods">
                  <Accordion.Control>How these summaries are made</Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="xs">
                      <Text size="sm">
                        <b>Adjusted score:</b> a normalized result from the
                        analysis, not a raw ballot point. Direct and cross are
                        summarized separately.
                      </Text>
                      <Text size="sm">
                        <b>n:</b> number of score observations, not necessarily
                        the number of different students or independent samples.
                        Scores can repeat students, teams, tournaments, and
                        judging contexts, so treat these averages as descriptive.
                      </Text>
                      <Text size="sm">
                        <b>Callout thresholds:</b> set independently in “Edit
                        insight thresholds” below. They control which patterns
                        are highlighted; they are display rules, not statistical
                        significance thresholds.
                      </Text>
                      <Text size="sm">
                        <b>Formal inference:</b> no confidence intervals,
                        significance tests, or adjustments for repeated
                        observations are calculated. Direct/cross averages may
                        also mask variation within a group.
                      </Text>
                      <Text size="sm">
                        <b>Student comparisons:</b> each student is compared
                        with their side’s average, which includes their own
                        scores. This is descriptive, not an independent control
                        group.
                      </Text>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
              <Accordion variant="contained" radius="md">
                <Accordion.Item value="thresholds">
                  <Accordion.Control>Edit insight thresholds</Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="md">
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">
                          Each callout has its own sample and difference rules.
                          Defaults match the current guide thresholds.
                        </Text>
                        <Button
                          size="xs"
                          variant="subtle"
                          onClick={resetThresholds}
                        >
                          Reset defaults
                        </Button>
                      </Group>

                      <Stack gap="xs">
                        <Text fw={600} size="sm">Attorney side difference</Text>
                        <SimpleGrid cols={{ base: 1, sm: 2 }}>
                          <ThresholdInput
                            label="Minimum observations per side"
                            value={thresholds.attorneySideMinCount}
                            onChange={(value) =>
                              updateThreshold("attorneySideMinCount", value)
                            }
                          />
                          <ThresholdInput
                            label="Minimum score gap"
                            value={thresholds.attorneySideMinGap}
                            onChange={(value) =>
                              updateThreshold("attorneySideMinGap", value)
                            }
                            min={0}
                            step={0.05}
                          />
                        </SimpleGrid>
                      </Stack>

                      <Stack gap="xs">
                        <Text fw={600} size="sm">Witness team-side difference</Text>
                        <SimpleGrid cols={{ base: 1, sm: 2 }}>
                          <ThresholdInput
                            label="Minimum observations per side"
                            value={thresholds.witnessSideMinCount}
                            onChange={(value) =>
                              updateThreshold("witnessSideMinCount", value)
                            }
                          />
                          <ThresholdInput
                            label="Minimum score gap"
                            value={thresholds.witnessSideMinGap}
                            onChange={(value) =>
                              updateThreshold("witnessSideMinGap", value)
                            }
                            min={0}
                            step={0.05}
                          />
                        </SimpleGrid>
                      </Stack>

                      <Stack gap="xs">
                        <Text fw={600} size="sm">Attorney scores by witness type</Text>
                        <SimpleGrid cols={{ base: 1, sm: 3 }}>
                          <ThresholdInput
                            label="Minimum observations per type"
                            value={thresholds.witnessTypeMinCount}
                            onChange={(value) =>
                              updateThreshold("witnessTypeMinCount", value)
                            }
                          />
                          <ThresholdInput
                            label="Minimum qualifying types"
                            value={thresholds.witnessTypeMinGroups}
                            onChange={(value) =>
                              updateThreshold("witnessTypeMinGroups", value)
                            }
                          />
                          <ThresholdInput
                            label="Minimum score gap"
                            value={thresholds.witnessTypeMinGap}
                            onChange={(value) =>
                              updateThreshold("witnessTypeMinGap", value)
                            }
                            min={0}
                            step={0.05}
                          />
                        </SimpleGrid>
                      </Stack>

                      <Stack gap="xs">
                        <Text fw={600} size="sm">Party-representative comparison</Text>
                        <SimpleGrid cols={{ base: 1, sm: 3 }}>
                          <ThresholdInput
                            label="Minimum party-rep observations"
                            value={thresholds.partyRepMinCount}
                            onChange={(value) =>
                              updateThreshold("partyRepMinCount", value)
                            }
                          />
                          <ThresholdInput
                            label="Minimum other-type observations"
                            value={thresholds.partyRepComparisonMinCount}
                            onChange={(value) =>
                              updateThreshold("partyRepComparisonMinCount", value)
                            }
                          />
                          <ThresholdInput
                            label="Minimum score gap"
                            value={thresholds.partyRepMinGap}
                            onChange={(value) =>
                              updateThreshold("partyRepMinGap", value)
                            }
                            min={0}
                            step={0.05}
                          />
                        </SimpleGrid>
                      </Stack>

                      <Stack gap="xs">
                        <Text fw={600} size="sm">Student relative-performance callouts</Text>
                        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
                          <ThresholdInput
                            label="Minimum student observations"
                            value={thresholds.studentMinCount}
                            onChange={(value) =>
                              updateThreshold("studentMinCount", value)
                            }
                          />
                          <ThresholdInput
                            label="Minimum side-cohort observations"
                            value={thresholds.studentCohortMinCount}
                            onChange={(value) =>
                              updateThreshold("studentCohortMinCount", value)
                            }
                          />
                          <ThresholdInput
                            label="Minimum score gap"
                            value={thresholds.studentMinGap}
                            onChange={(value) =>
                              updateThreshold("studentMinGap", value)
                            }
                            min={0}
                            step={0.05}
                          />
                          <ThresholdInput
                            label="Observations on same side of average (%)"
                            value={thresholds.studentConsistencyPercent}
                            onChange={(value) =>
                              updateThreshold("studentConsistencyPercent", value)
                            }
                            min={0}
                            max={100}
                          />
                        </SimpleGrid>
                      </Stack>

                      <Stack gap="xs">
                        <Text fw={600} size="sm">Lower-scoring character callouts</Text>
                        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
                          <ThresholdInput
                            label="Minimum character observations"
                            value={thresholds.characterMinCount}
                            onChange={(value) =>
                              updateThreshold("characterMinCount", value)
                            }
                          />
                          <ThresholdInput
                            label="Minimum identified-character observations"
                            value={thresholds.characterCohortMinCount}
                            onChange={(value) =>
                              updateThreshold("characterCohortMinCount", value)
                            }
                          />
                          <ThresholdInput
                            label="Minimum score gap"
                            value={thresholds.characterMinGap}
                            onChange={(value) =>
                              updateThreshold("characterMinGap", value)
                            }
                            min={0}
                            step={0.05}
                          />
                          <ThresholdInput
                            label="Observations below average (%)"
                            value={thresholds.characterConsistencyPercent}
                            onChange={(value) =>
                              updateThreshold("characterConsistencyPercent", value)
                            }
                            min={0}
                            max={100}
                          />
                        </SimpleGrid>
                      </Stack>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Stack>

            <Title order={3}>Attorney trends</Title>
            <Title order={4}>Attorney score by side</Title>
            {trends.attorneyBySide.length ? (
              <SideComparison rows={trends.attorneyBySide} domain={scoreDomain} />
            ) : (
              <Text c="dimmed">No valid attorney scores are available.</Text>
            )}

            <Title order={4}>
              Attorney scores by witness type and attorney team side
            </Title>
            {attorneyTypeSideRows.length ? (
              <>
                <TrendChart
                  data={getChartRows(attorneyTypeSideRows)}
                  domain={scoreDomain}
                  height={Math.max(280, attorneyTypeSideRows.length * 34)}
                />
                <GroupedScoresTable
                  rows={attorneyTypeSideRows}
                  firstColumnTitle="Witness type"
                  showSide
                  sideTitle="Attorney side"
                />
              </>
            ) : (
              <Text c="dimmed">
                No valid attorney scores are available by witness type.
              </Text>
            )}

            <Title order={4}>Attorney scores by individual witness</Title>
            {trends.attorneyByWitness.length ? (
              <>
                <Text size="sm" c="dimmed">
                  Top 10 by highest direct or cross average.
                </Text>
                <TrendChart
                  data={getChartRows(topAttorneyWitnesses || [])}
                  domain={scoreDomain}
                  height={Math.max(220, (topAttorneyWitnesses?.length || 0) * 38)}
                />
                <Accordion variant="contained" radius="md">
                  <Accordion.Item value="attorney-witness-table">
                    <Accordion.Control>
                      All matched witnesses ({trends.attorneyByWitness.length})
                    </Accordion.Control>
                    <Accordion.Panel>
                      <GroupedScoresTable
                        rows={trends.attorneyByWitness}
                        firstColumnTitle="Witness"
                        showType
                        showSide
                        sideTitle="Character side"
                      />
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              </>
            ) : (
              <Text c="dimmed">
                No attorney direct or cross scores have matched witness
                identities.
              </Text>
            )}

            <Divider my="xs" />
            <Title order={3}>Witness trends</Title>
            <Title order={4}>Witness scores by team side</Title>
            {trends.witnessBySide.length ? (
              <SideComparison rows={trends.witnessBySide} domain={scoreDomain} />
            ) : (
              <Text c="dimmed">No valid witness scores are available.</Text>
            )}

            <Title order={4}>Witness scores by type and side</Title>
            {witnessTypeSideRows.length ? (
              <>
                <TrendChart
                  data={getChartRows(witnessTypeSideRows)}
                  domain={scoreDomain}
                  height={Math.max(280, witnessTypeSideRows.length * 34)}
                />
                <GroupedScoresTable
                  rows={witnessTypeSideRows}
                  firstColumnTitle="Witness type"
                  showSide
                  sideTitle="Team side"
                />
              </>
            ) : (
              <Text c="dimmed">No valid witness scores are available.</Text>
            )}

            <Title order={4}>Witness scores by individual character</Title>
            {trends.witnessByCharacter.length ? (
              <>
                <Text size="sm" c="dimmed">
                  Top 10 by highest direct or cross average.
                </Text>
                <TrendChart
                  data={getChartRows(topWitnessCharacters || [])}
                  domain={scoreDomain}
                  height={Math.max(220, (topWitnessCharacters?.length || 0) * 38)}
                />
                <Accordion variant="contained" radius="md">
                  <Accordion.Item value="character-table">
                    <Accordion.Control>
                      All identified characters ({trends.witnessByCharacter.length})
                    </Accordion.Control>
                    <Accordion.Panel>
                      <GroupedScoresTable
                        rows={trends.witnessByCharacter}
                        firstColumnTitle="Character"
                        showType
                        showSide
                        sideTitle="Character side"
                      />
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              </>
            ) : (
              <Text c="dimmed">
                No witness scores are linked to individual character identities.
              </Text>
            )}
          </>
        )}
      </Stack>
    </PageSection>
  );
}
