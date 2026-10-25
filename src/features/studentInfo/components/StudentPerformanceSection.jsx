import {
  Accordion,
  Alert,
  Badge,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Select,
} from "@mantine/core";
import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PageSection from "../../../common/components/PageSection";
import { useSchoolStudents } from "../../../common/hooks/useSchoolDetails";
import { useStudentPerformanceHistory } from "../hooks/useStudentPerformanceHistory";
import {
  buildStudentPerformanceTrend,
  calculateStudentPerformance,
  summarizeStudentPerformance,
} from "../utils/studentPerformance";

const ALL = "all";
const SERIES_COLORS = [
  "#1971c2",
  "#e8590c",
  "#2f9e44",
  "#9c36b5",
  "#0c8599",
  "#c2255c",
  "#e67700",
  "#5c940d",
];

const GROUP_OPTIONS = [
  { value: "overall", label: "Overall" },
  { value: "role", label: "Role" },
  { value: "side", label: "Case side" },
  { value: "activity", label: "Activity" },
  { value: "witnessType", label: "Witness type" },
  { value: "roleSide", label: "Role and side" },
  { value: "roleActivity", label: "Role and activity" },
  { value: "roleWitnessType", label: "Role and witness type" },
  {
    value: "roleActivityWitnessType",
    label: "Role, activity, and witness type",
  },
  {
    value: "roleSideActivityWitnessType",
    label: "Role, side, activity, and witness type",
  },
];

function formatScore(value) {
  if (value === null || value === undefined) return "—";
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}`;
}

function formatDate(date) {
  if (!date) return "Date unavailable";
  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime())
    ? "Date unavailable"
    : parsed.toLocaleDateString();
}

function formatShortDate(date) {
  if (!date) return "—";
  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime())
    ? "—"
    : parsed.toLocaleDateString(undefined, {
        month: "short",
        year: "2-digit",
      });
}

function MetricCard({ label, value, detail }) {
  return (
    <Card withBorder>
      <Stack gap={4}>
        <Text size="sm" c="dimmed">
          {label}
        </Text>
        <Text fw={700} size="xl">
          {value}
        </Text>
        <Text size="xs" c="dimmed">
          {detail}
        </Text>
      </Stack>
    </Card>
  );
}

function getFilteredObservations(observations, filters) {
  return observations.filter(
    (item) =>
      (filters.role === ALL || item.role === filters.role) &&
      (filters.side === ALL || item.side === filters.side) &&
      (filters.activity === ALL || item.activity === filters.activity) &&
      (filters.witnessType === ALL ||
        (filters.witnessType === "unrecorded"
          ? !item.witnessType
          : item.witnessType === filters.witnessType)),
  );
}

function getOptions(values, allLabel) {
  return [
    { value: ALL, label: allLabel },
    ...Array.from(new Set(values.filter(Boolean)))
      .sort((a, b) => a.localeCompare(b))
      .map((value) => ({ value, label: value })),
  ];
}

function PerformanceFilters({
  filters,
  setFilters,
  observations,
  includeGroupBy = false,
  groupBy,
  setGroupBy,
}) {
  const witnessTypes = Array.from(
    new Set(observations.map((item) => item.witnessType).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));

  return (
    <SimpleGrid cols={{ base: 1, xs: 2, lg: includeGroupBy ? 5 : 4 }}>
      <Select
        label="Student role"
        value={filters.role}
        data={[
          { value: ALL, label: "All roles" },
          { value: "Attorney", label: "Attorney" },
          { value: "Witness", label: "Witness" },
        ]}
        onChange={(value) =>
          setFilters((current) => ({ ...current, role: value || ALL }))
        }
      />
      <Select
        label="Case side"
        value={filters.side}
        data={getOptions(
          observations.map((item) => item.side),
          "All sides",
        )}
        onChange={(value) =>
          setFilters((current) => ({ ...current, side: value || ALL }))
        }
      />
      <Select
        label="Activity"
        value={filters.activity}
        data={getOptions(
          observations.map((item) => item.activity),
          "All activities",
        )}
        onChange={(value) =>
          setFilters((current) => ({ ...current, activity: value || ALL }))
        }
      />
      <Select
        label="Witness type"
        value={filters.witnessType}
        data={[
          { value: ALL, label: "All witness types" },
          ...witnessTypes.map((type) => ({ value: type, label: type })),
          { value: "unrecorded", label: "Type not recorded" },
        ]}
        onChange={(value) =>
          setFilters((current) => ({
            ...current,
            witnessType: value || ALL,
          }))
        }
      />
      {includeGroupBy && (
        <Select
          label="Compare over time by"
          value={groupBy}
          data={GROUP_OPTIONS}
          onChange={(value) => setGroupBy(value || "overall")}
        />
      )}
    </SimpleGrid>
  );
}

function PerformanceBreakdown({ observations }) {
  const [filters, setFilters] = useState({
    role: ALL,
    side: ALL,
    activity: ALL,
    witnessType: ALL,
  });
  const [groupBy, setGroupBy] = useState("roleActivityWitnessType");
  const filtered = getFilteredObservations(observations, filters);
  const rows = summarizeStudentPerformance(filtered, groupBy).sort(
    (a, b) => (b.average ?? -Infinity) - (a.average ?? -Infinity),
  );

  return (
    <Stack gap="md">
      <Text size="sm" c="dimmed">
        Narrow the results to a role, side, action, and witness type, then
        choose how to compare the remaining scores. For example: select
        Attorney, Defense, Direct, and Expert to see that combination.
      </Text>
      <PerformanceFilters
        filters={filters}
        setFilters={setFilters}
        observations={observations}
      />
      <Select
        label="Group results by"
        value={groupBy}
        data={GROUP_OPTIONS}
        onChange={(value) => setGroupBy(value || "roleActivityWitnessType")}
      />
      {rows.length === 0 ? (
        <Text size="sm" c="dimmed">
          No scored results match these choices.
        </Text>
      ) : (
        <>
          <Text size="sm" c="dimmed">
            Showing {filtered.length} score observations. Positive scores were
            above the ballot average; negative scores were below it.
          </Text>
          <Table.ScrollContainer minWidth={520}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Comparison</Table.Th>
                  <Table.Th>Average vs. ballot</Table.Th>
                  <Table.Th>Times scored</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rows.map((row) => (
                  <Table.Tr key={row.label}>
                    <Table.Td>{row.label}</Table.Td>
                    <Table.Td>{formatScore(row.average)}</Table.Td>
                    <Table.Td>{row.count}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </>
      )}
    </Stack>
  );
}

function PerformanceTrend({ observations }) {
  const [filters, setFilters] = useState({
    role: ALL,
    side: ALL,
    activity: ALL,
    witnessType: ALL,
  });
  const [groupBy, setGroupBy] = useState("role");
  const filtered = getFilteredObservations(observations, filters);
  const trend = buildStudentPerformanceTrend(filtered, groupBy);

  return (
    <Stack gap="md">
      <Text size="sm" c="dimmed">
        Track scores from tournament to tournament. Use the same filters to
        focus on one kind of performance, or compare groups in the chart.
      </Text>
      <PerformanceFilters
        filters={filters}
        setFilters={setFilters}
        observations={observations}
        includeGroupBy
        groupBy={groupBy}
        setGroupBy={setGroupBy}
      />
      {trend.rows.length === 0 ? (
        <Text size="sm" c="dimmed">
          No scored results match these choices.
        </Text>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={340}>
            <LineChart
              data={trend.rows}
              margin={{ top: 12, right: 24, bottom: 12, left: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="order"
                type="number"
                domain={[1, Math.max(1, trend.rows.length)]}
                ticks={trend.rows.map((row) => row.order)}
                tickFormatter={(order) =>
                  formatShortDate(
                    trend.rows.find((row) => row.order === order)?.date,
                  )
                }
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={(value) => Number(value).toFixed(1)}
                width={48}
                label={{
                  value: "Average score vs. ballot",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" },
                }}
              />
              <Tooltip
                labelFormatter={(order) => {
                  const tournament = trend.rows.find(
                    (row) => row.order === Number(order),
                  );
                  return tournament
                    ? `${tournament.name} · ${formatDate(tournament.date)}`
                    : "";
                }}
                formatter={(value, name, item) =>
                  value === null || value === undefined
                    ? ["No scores", name]
                    : [
                        `${formatScore(Number(value))} · ${
                          item.payload[`${name}Count`]
                        } times scored`,
                        name,
                      ]
                }
              />
              <Legend />
              <ReferenceLine y={0} stroke="#868e96" strokeDasharray="4 4" />
              {trend.series.map((series, index) => (
                <Line
                  key={series}
                  connectNulls={false}
                  type="monotone"
                  dataKey={series}
                  name={series}
                  stroke={SERIES_COLORS[index % SERIES_COLORS.length]}
                  strokeWidth={2}
                  activeDot={{ r: 5 }}
                  dot={{ r: 3 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <Text size="xs" c="dimmed">
            Each point is a tournament average. A point farther above zero means
            scores were further above that ballot’s average. Hover over a point
            for the tournament date and number of scores.
          </Text>
          <Table.ScrollContainer minWidth={520}>
            <Table striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Tournament</Table.Th>
                  {trend.series.map((series) => (
                    <Table.Th key={series}>{series}</Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {trend.rows.map((row) => (
                  <Table.Tr key={row.tournamentId}>
                    <Table.Td>
                      {row.name}
                      <Text size="xs" c="dimmed">
                        {formatDate(row.date)}
                      </Text>
                    </Table.Td>
                    {trend.series.map((series) => (
                      <Table.Td key={series}>
                        {row[series] === null
                          ? "—"
                          : `${formatScore(row[series])} · ${
                              row[`${series}Count`]
                            } scores`}
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </>
      )}
    </Stack>
  );
}

function StudentComparison({
  studentId,
  studentName,
  students,
  comparisonStudentId,
  setComparisonStudentId,
  comparisonRecords,
  comparisonLoading,
  comparisonError,
  currentRecords,
}) {
  const [filters, setFilters] = useState({
    role: ALL,
    side: ALL,
    activity: ALL,
    witnessType: ALL,
  });
  const [groupBy, setGroupBy] = useState("roleSideActivityWitnessType");
  const comparisonStudent = students.find(
    (student) => student.id === comparisonStudentId,
  );
  const current = calculateStudentPerformance(currentRecords, studentId);
  const comparison = calculateStudentPerformance(
    comparisonRecords,
    comparisonStudentId,
  );

  const combinedObservations = [
    ...current.observations,
    ...comparison.observations,
  ];
  const filteredCurrent = getFilteredObservations(
    current.observations,
    filters,
  );
  const filteredComparison = getFilteredObservations(
    comparison.observations,
    filters,
  );
  const currentRows = summarizeStudentPerformance(filteredCurrent, groupBy);
  const comparisonRows = summarizeStudentPerformance(
    filteredComparison,
    groupBy,
  );
  const labels = Array.from(
    new Set([
      ...currentRows.map((row) => row.label),
      ...comparisonRows.map((row) => row.label),
    ]),
  ).sort((a, b) => a.localeCompare(b));
  const rows = labels.map((label) => {
    const currentRow = currentRows.find((row) => row.label === label);
    const comparisonRow = comparisonRows.find((row) => row.label === label);
    return {
      label,
      currentAverage: currentRow?.average ?? null,
      currentCount: currentRow?.count ?? 0,
      comparisonAverage: comparisonRow?.average ?? null,
      comparisonCount: comparisonRow?.count ?? 0,
      difference:
        currentRow?.average !== null &&
        currentRow?.average !== undefined &&
        comparisonRow?.average !== null &&
        comparisonRow?.average !== undefined
          ? currentRow.average - comparisonRow.average
          : null,
    };
  });

  return (
    <Stack gap="md">
      <Text size="sm" c="dimmed">
        Choose another student to compare performance using the same ballot
        score baseline. Filter to a specific combination to see how the
        comparison changes.
      </Text>
      <Select
        label="Compare with"
        placeholder="Choose a student"
        searchable
        clearable
        value={comparisonStudentId}
        data={students
          .filter((student) => student.is_active && student.id !== studentId)
          .map((student) => ({
            value: student.id,
            label: student.name,
          }))}
        onChange={setComparisonStudentId}
      />
      {!comparisonStudentId ? (
        <Text size="sm" c="dimmed">
          Select a student to see a side-by-side comparison.
        </Text>
      ) : comparisonLoading ? (
        <Text size="sm" c="dimmed">
          Loading {comparisonStudent?.name ?? "student"}’s performance…
        </Text>
      ) : comparisonError ? (
        <Alert color="red" title="Unable to load comparison student">
          {comparisonError.message}
        </Alert>
      ) : (
        <>
          <PerformanceFilters
            filters={filters}
            setFilters={setFilters}
            observations={combinedObservations}
          />
          <Select
            label="Compare by"
            value={groupBy}
            data={GROUP_OPTIONS}
            onChange={(value) =>
              setGroupBy(value || "roleSideActivityWitnessType")
            }
          />
          {rows.length === 0 ? (
            <Text size="sm" c="dimmed">
              No scored results match these choices.
            </Text>
          ) : (
            <>
              <Text size="sm" c="dimmed">
                Difference is {studentName}’s average minus{" "}
                {comparisonStudent?.name ?? "the second student"}
                ’s average. A difference is shown only when both students have
                scores for the same group.
              </Text>
              <Text size="sm" c="dimmed">
                Positive values mean {studentName} scored further above the
                ballot average for that comparison. Negative values mean{" "}
                {comparisonStudent?.name ?? "the second student"} scored further
                above the ballot average for that comparison.
              </Text>
              <Table.ScrollContainer minWidth={720}>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Role / activity / context</Table.Th>
                      <Table.Th>{studentName}</Table.Th>
                      <Table.Th>{comparisonStudent?.name}</Table.Th>
                      <Table.Th>Difference</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {rows.map((row) => (
                      <Table.Tr key={row.label}>
                        <Table.Td>{row.label}</Table.Td>
                        <Table.Td>
                          {row.currentAverage === null
                            ? "—"
                            : `${formatScore(row.currentAverage)} (${row.currentCount} scores)`}
                        </Table.Td>
                        <Table.Td>
                          {row.comparisonAverage === null
                            ? "—"
                            : `${formatScore(row.comparisonAverage)} (${row.comparisonCount} scores)`}
                        </Table.Td>
                        <Table.Td>{formatScore(row.difference)}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </>
          )}
        </>
      )}
    </Stack>
  );
}

function TournamentHistory({ tournaments }) {
  if (tournaments.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        No tournament rounds are recorded for this student.
      </Text>
    );
  }

  return (
    <Accordion variant="separated">
      {tournaments.map((tournament, index) => (
        <Accordion.Item key={tournament.id} value={`${tournament.id}-${index}`}>
          <Accordion.Control>
            <Group justify="space-between" wrap="wrap" pr="sm">
              <Stack gap={0}>
                <Text fw={600}>{tournament.name}</Text>
                <Text size="sm" c="dimmed">
                  {formatDate(tournament.date)}
                </Text>
              </Stack>
              <Group gap="xs">
                <Badge variant="light">{tournament.rounds.length} rounds</Badge>
                <Badge
                  color={tournament.doubleSided ? "teal" : "gray"}
                  variant="light"
                >
                  {tournament.doubleSided ? "Double-sided" : "Single-sided"}
                </Badge>
                <Text size="sm">
                  Avg {formatScore(tournament.average)} · {tournament.count}{" "}
                  scores
                </Text>
              </Group>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            {tournament.rounds.length === 0 ? (
              <Text size="sm" c="dimmed">
                No round details are available.
              </Text>
            ) : (
              <Table.ScrollContainer minWidth={520}>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Round</Table.Th>
                      <Table.Th>Side</Table.Th>
                      <Table.Th>Student roles</Table.Th>
                      <Table.Th>Average vs. ballot</Table.Th>
                      <Table.Th>Scores</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {tournament.rounds.map((round) => (
                      <Table.Tr key={round.id}>
                        <Table.Td>{round.number ?? "—"}</Table.Td>
                        <Table.Td>{round.side}</Table.Td>
                        <Table.Td>
                          {round.roles.length > 0
                            ? Array.from(new Set(round.roles)).join(", ")
                            : "—"}
                        </Table.Td>
                        <Table.Td>{formatScore(round.average)}</Table.Td>
                        <Table.Td>{round.count}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            )}
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

export default function StudentPerformanceSection({
  studentId,
  studentName,
  schoolId,
}) {
  const {
    data: records = [],
    isLoading,
    error,
  } = useStudentPerformanceHistory(studentId);
  const { data: students = [] } = useSchoolStudents(schoolId);
  const [comparisonStudentId, setComparisonStudentId] = useState(null);
  const {
    data: comparisonRecords = [],
    isLoading: comparisonLoading,
    error: comparisonError,
  } = useStudentPerformanceHistory(comparisonStudentId);
  const analysis = calculateStudentPerformance(records, studentId);
  const roleSummaries = summarizeStudentPerformance(
    analysis.observations,
    "role",
  );
  const leadSummary = roleSummaries
    .filter((item) => item.count > 0)
    .sort((a, b) => (b.average ?? -Infinity) - (a.average ?? -Infinity))[0];

  return (
    <PageSection title="Performance history" collapsible defaultOpen>
      {isLoading ? (
        <Text size="sm" c="dimmed">
          Loading tournament performance…
        </Text>
      ) : error ? (
        <Alert color="red" title="Unable to load performance history">
          {error.message}
        </Alert>
      ) : (
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Start with the summary, then filter and compare specific roles,
            sides, actions, and witness types. Each section includes its own
            guide to interpreting the scores.
          </Text>

          <SimpleGrid cols={{ base: 2, sm: 4 }}>
            <MetricCard
              label="Tournaments"
              value={analysis.summary.tournamentCount}
              detail="with recorded student rounds"
            />
            <MetricCard
              label="Rounds"
              value={analysis.summary.roundCount}
              detail="with recorded student roles"
            />
            <MetricCard
              label="Times scored"
              value={analysis.summary.observationCount}
              detail="scores included in comparisons"
            />
            <MetricCard
              label="Highest average by role"
              value={leadSummary ? leadSummary.label : "—"}
              detail={
                leadSummary
                  ? `${formatScore(leadSummary.average)} vs. ballot average · ${leadSummary.count} scores`
                  : "No scored roles yet"
              }
            />
          </SimpleGrid>

          <Accordion variant="contained">
            <Accordion.Item value="score-guide">
              <Accordion.Control>How to read these scores</Accordion.Control>
              <Accordion.Panel>
                <Stack gap="xs">
                  <Text size="sm">
                    Each role score is compared with the average of the scores
                    on the same ballot. A positive number means the student’s
                    role score was higher than that ballot average; a negative
                    number means it was lower. This is a relative comparison,
                    not a grade or a win/loss prediction.
                  </Text>
                  <Text size="sm">
                    The average combines scores using the ballot’s saved score
                    weights. “Times scored” shows how many score observations
                    support a comparison. Small counts are less conclusive.
                  </Text>
                  <Text size="sm">
                    A tournament is double-sided when four rounds are recorded
                    for the student, two on each side. Other tournaments are
                    shown as single-sided.
                  </Text>
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>

          <Accordion variant="separated" defaultValue="breakdown">
            <Accordion.Item value="breakdown">
              <Accordion.Control>
                <Stack gap={2}>
                  <Text fw={600}>Compare specific performances</Text>
                  <Text size="sm" c="dimmed">
                    Answer questions about role, side, activity, and witness
                    type
                  </Text>
                </Stack>
              </Accordion.Control>
              <Accordion.Panel>
                <PerformanceBreakdown observations={analysis.observations} />
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="trend">
              <Accordion.Control>
                <Stack gap={2}>
                  <Text fw={600}>Performance over time</Text>
                  <Text size="sm" c="dimmed">
                    Follow any role or activity across tournament dates
                  </Text>
                </Stack>
              </Accordion.Control>
              <Accordion.Panel>
                <PerformanceTrend observations={analysis.observations} />
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="student-comparison">
              <Accordion.Control>
                <Stack gap={2}>
                  <Text fw={600}>Compare two students</Text>
                  <Text size="sm" c="dimmed">
                    Compare the same roles, sides, activities, and witness types
                  </Text>
                </Stack>
              </Accordion.Control>
              <Accordion.Panel>
                <StudentComparison
                  studentId={studentId}
                  studentName={studentName}
                  students={students}
                  comparisonStudentId={comparisonStudentId}
                  setComparisonStudentId={setComparisonStudentId}
                  comparisonRecords={comparisonRecords}
                  comparisonLoading={comparisonLoading}
                  comparisonError={comparisonError}
                  currentRecords={records}
                />
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="history">
              <Accordion.Control>
                <Stack gap={2}>
                  <Text fw={600}>Tournament and round details</Text>
                  <Text size="sm" c="dimmed">
                    Inspect the individual records behind the summaries
                  </Text>
                </Stack>
              </Accordion.Control>
              <Accordion.Panel>
                <TournamentHistory tournaments={analysis.tournaments} />
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Stack>
      )}
    </PageSection>
  );
}
