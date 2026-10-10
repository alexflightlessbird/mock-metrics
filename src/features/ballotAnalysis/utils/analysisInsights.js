export const DEFAULT_INSIGHT_THRESHOLDS = {
  attorneySideMinCount: 8,
  attorneySideMinGap: 0.5,
  witnessSideMinCount: 8,
  witnessSideMinGap: 0.5,
  witnessTypeMinCount: 5,
  witnessTypeMinGroups: 2,
  witnessTypeMinGap: 0.75,
  partyRepMinCount: 5,
  partyRepComparisonMinCount: 1,
  partyRepMinGap: 0.75,
  studentMinCount: 3,
  studentCohortMinCount: 8,
  studentMinGap: 0.75,
  studentConsistencyPercent: 60,
  characterMinCount: 3,
  characterCohortMinCount: 8,
  characterMinGap: 0.75,
  characterConsistencyPercent: 60,
};

function finiteScore(value) {
  if (value === null || value === undefined || value === "") return null;
  const score = Number(value);
  return Number.isFinite(score) ? score : null;
}

function sideLabel(side, pSideLabel = "Plaintiff/Prosecution") {
  if (side === "p") return pSideLabel;
  if (side === "d") return "Defense";
  if (side === "s") return "Swing";
  return side || "Unknown side";
}

function summarizeValues(values) {
  const validValues = values.map(finiteScore).filter((value) => value !== null);
  if (!validValues.length) return null;

  return {
    average: validValues.reduce((sum, value) => sum + value, 0) / validValues.length,
    count: validValues.length,
  };
}

function formatScore(value) {
  return value.toFixed(2);
}

function addSideInsights(insights, data, metricLabel, chartLabel, thresholds) {
  const pSideRows = data.filter((row) =>
    ["Plaintiff", "Prosecution"].includes(row.label),
  );
  if (pSideRows.length !== 1) return;
  const pSide = pSideRows[0];
  const defense = data.find((row) => row.label === "Defense");
  if (!pSide || !defense) return;

  [
    ["directAverage", "directCount", "direct"],
    ["crossAverage", "crossCount", "cross"],
  ].forEach(([averageKey, countKey, scoreName]) => {
    if (
      pSide[averageKey] === null ||
      defense[averageKey] === null ||
      pSide[countKey] < thresholds.minCount ||
      defense[countKey] < thresholds.minCount ||
      Math.abs(defense[averageKey] - pSide[averageKey]) < thresholds.minGap
    )
      return;

    insights.push({
      title: `${metricLabel}: ${scoreName} by side`,
      direction: defense[averageKey] > pSide[averageKey] ? "above" : "below",
      subject:
        defense[averageKey] > pSide[averageKey] ? "Defense" : pSide.label,
      comparison:
        defense[averageKey] > pSide[averageKey] ? pSide.label : "Defense",
      body: `${defense[averageKey] > pSide[averageKey] ? "Defense" : pSide.label} is higher by ${formatScore(Math.abs(defense[averageKey] - pSide[averageKey]) )}: Defense ${formatScore(defense[averageKey])} (n=${defense[countKey]}) vs ${pSide.label} ${formatScore(pSide[averageKey])} (n=${pSide[countKey]}).`,
      chart: chartLabel,
    });
  });
}

function addPartyRepInsight(insights, trends, thresholds) {
  const partyRep = trends.witnessByType.find(
    (row) => row.type?.toLowerCase() === "party rep",
  );
  if (!partyRep) return;

  const otherRows = trends.witnessByType.filter(
    (row) => row.type?.toLowerCase() !== "party rep",
  );
  [
    ["directAverage", "directCount", "direct"],
    ["crossAverage", "crossCount", "cross"],
  ].forEach(([averageKey, countKey, metric]) => {
    const otherValues = otherRows.flatMap((row) =>
      Array.from({ length: row[countKey] }, () => row[averageKey]),
    );
    const otherSummary = summarizeValues(otherValues);
    if (
      partyRep[averageKey] === null ||
      partyRep[countKey] < thresholds.minCount ||
      !otherSummary ||
      otherSummary.count < thresholds.comparisonMinCount ||
      Math.abs(partyRep[averageKey] - otherSummary.average) < thresholds.minGap
    )
      return;

    insights.push({
      title: `Party-representative ${metric} scores`,
      direction:
        partyRep[averageKey] > otherSummary.average ? "above" : "below",
      subject:
        partyRep[averageKey] > otherSummary.average
          ? "Party rep"
          : "Other witness types",
      comparison:
        partyRep[averageKey] > otherSummary.average
          ? "other witness types"
          : "party reps",
      body: `Party rep ${formatScore(partyRep[averageKey])} (n=${partyRep[countKey]}) vs other types ${formatScore(otherSummary.average)} (n=${otherSummary.count}); gap ${formatScore(Math.abs(partyRep[averageKey] - otherSummary.average))}. This is an association, not proof the role caused the difference.`,
      chart: "Witness scores by type and side",
    });
  });
}

function addWitnessTypeInsights(insights, typeRows, thresholds) {
  const qualifyingRows = typeRows.filter(
    (row) => row.crossCount >= thresholds.minCount && row.crossAverage !== null,
  );
  if (qualifyingRows.length < thresholds.minGroups) return;

  const highest = [...qualifyingRows].sort(
    (a, b) => b.crossAverage - a.crossAverage,
  )[0];
  const lowest = [...qualifyingRows].sort(
    (a, b) => a.crossAverage - b.crossAverage,
  )[0];
  const gap = highest.crossAverage - lowest.crossAverage;
  if (gap < thresholds.minGap) return;

  insights.push({
    title: "Cross-score differences by witness type",
    direction: "range",
    aboveLabel: highest.type,
    belowLabel: lowest.type,
    body: `${highest.type} is highest at ${formatScore(highest.crossAverage)} (n=${highest.crossCount}); ${lowest.type} is lowest at ${formatScore(lowest.crossAverage)} (n=${lowest.crossCount}). Gap: ${formatScore(gap)}. Assignment and sample differences may contribute.`,
    chart: "Attorney scores by witness type and attorney side",
  });
}

function getStudentOutliers(entries, roleName, thresholds) {
  const students = new Map();
  const cohortValuesBySide = new Map();

  entries.forEach((entry) => {
    const studentId = entry.student?.id;
    if (studentId === null || studentId === undefined) return;
    (entry.scores || []).forEach((score) => {
      const side = score.sideLabel || sideLabel(entry.side, entry.pSideLabel);
      const key = `${studentId}:${side}`;
      const values = ["direct", "cross"]
        .map((metric) => finiteScore(score?.[metric]?.score))
        .filter((value) => value !== null);
      if (!values.length) return;

      if (!students.has(key)) {
        students.set(key, {
          id: studentId,
          name: entry.student?.name || "Unnamed student",
          side,
          values: [],
        });
      }
      students.get(key).values.push(...values);
      if (!cohortValuesBySide.has(side)) cohortValuesBySide.set(side, []);
      cohortValuesBySide.get(side).push(...values);
    });
  });

  const summaries = Array.from(students.values()).map((student) => {
    const cohort = cohortValuesBySide.get(student.side) || [];
    const cohortAverage =
      cohort.reduce((sum, value) => sum + value, 0) / (cohort.length || 1);
    const summary = summarizeValues(student.values);

    return {
      ...student,
      ...summary,
      cohortAverage,
      aboveCount: student.values.filter((value) => value > cohortAverage).length,
      belowCount: student.values.filter((value) => value < cohortAverage).length,
      cohortCount: cohort.length,
    };
  });

  const candidates = summaries.filter((student) => {
    const cohort = cohortValuesBySide.get(student.side) || [];
    const positionCount =
      student.average > student.cohortAverage
        ? student.aboveCount
        : student.belowCount;
    return (
      student.count >= thresholds.minCount &&
      cohort.length >= thresholds.cohortMinCount &&
      Math.abs(student.average - student.cohortAverage) >= thresholds.minGap &&
      positionCount >= Math.ceil(
        student.count * (thresholds.consistencyPercent / 100),
      )
    );
  });

  const below = candidates
    .filter((student) => student.average < student.cohortAverage)
    .sort((a, b) =>
      (a.average - a.cohortAverage) - (b.average - b.cohortAverage),
    )
    .slice(0, 3);
  const above = candidates
    .filter((student) => student.average > student.cohortAverage)
    .sort((a, b) =>
      (b.average - b.cohortAverage) - (a.average - a.cohortAverage),
    )
    .slice(0, 3);

  return [
    ...above.map((student) => ({ ...student, relativePosition: "above" })),
    ...below.map((student) => ({ ...student, relativePosition: "below" })),
  ].map((student) => ({
    title: `${roleName} performance to review`,
    direction: student.relativePosition,
    subject: student.name,
    comparison: `${student.side} average`,
    body: `${student.name}: ${formatScore(student.average)} (n=${student.count}) vs ${student.side} average ${formatScore(student.cohortAverage)} (n=${student.cohortCount}); ${student.relativePosition === "above" ? student.aboveCount : student.belowCount}/${student.count} observations were ${student.relativePosition} that average. Review the rounds and assignments; this is not a judgment of ability.`,
    chart: `${roleName} overall scores table`,
  }));
}

function addLowCharacterInsights(insights, characterRows, thresholds) {
  const qualifyingRows = characterRows.filter((row) => {
    const combinedCount = row.directCount + row.crossCount;
    return combinedCount >= thresholds.minCount;
  });
  const allScores = qualifyingRows.flatMap((row) => [
    ...Array.from({ length: row.directCount }, () => row.directAverage),
    ...Array.from({ length: row.crossCount }, () => row.crossAverage),
  ]);
  const cohort = summarizeValues(allScores);
  if (!cohort || cohort.count < thresholds.cohortMinCount) return;

  qualifyingRows
    .map((row) => {
      const observations = [
        ...Array.from({ length: row.directCount }, () => row.directAverage),
        ...Array.from({ length: row.crossCount }, () => row.crossAverage),
      ];
      const summary = summarizeValues(observations);
      const belowCount = observations.filter(
        (value) => value < cohort.average,
      ).length;
      return { ...row, ...summary, belowCount };
    })
    .filter(
      (row) =>
        row.average <= cohort.average - thresholds.minGap &&
        row.belowCount >=
          Math.ceil(row.count * (thresholds.consistencyPercent / 100)),
    )
    .sort((a, b) => a.average - b.average)
    .slice(0, 3)
    .forEach((row) => {
      insights.push({
        title: "Character with consistently lower witness scores",
        direction: "below",
        subject: row.label,
        comparison: "identified-character average",
        body: `${row.label}: ${formatScore(row.average)} (n=${row.count}) vs identified-character average ${formatScore(cohort.average)} (n=${cohort.count}); ${row.belowCount}/${row.count} observations were below average. Check its type and side; assignments and judging context may explain the pattern.`,
        chart: "Witness scores by individual character",
      });
    });
}

export function generateAnalysisInsights({
  attorneys = [],
  witnesses = [],
  trends,
  thresholds: thresholdOverrides = {},
}) {
  const insights = [];
  if (!trends) return insights;
  const thresholds = {
    ...DEFAULT_INSIGHT_THRESHOLDS,
    ...thresholdOverrides,
  };

  addSideInsights(
    insights,
    trends.attorneyBySide,
    "Attorney scores",
    "Attorney score by side",
    {
      minCount: thresholds.attorneySideMinCount,
      minGap: thresholds.attorneySideMinGap,
    },
  );
  addSideInsights(
    insights,
    trends.witnessBySide,
    "Witness scores",
    "Witness scores by team side",
    {
      minCount: thresholds.witnessSideMinCount,
      minGap: thresholds.witnessSideMinGap,
    },
  );
  addWitnessTypeInsights(insights, trends.attorneyByWitnessType, {
    minCount: thresholds.witnessTypeMinCount,
    minGroups: thresholds.witnessTypeMinGroups,
    minGap: thresholds.witnessTypeMinGap,
  });
  addPartyRepInsight(insights, trends, {
    minCount: thresholds.partyRepMinCount,
    comparisonMinCount: thresholds.partyRepComparisonMinCount,
    minGap: thresholds.partyRepMinGap,
  });
  addLowCharacterInsights(insights, trends.witnessByCharacter, {
    minCount: thresholds.characterMinCount,
    cohortMinCount: thresholds.characterCohortMinCount,
    minGap: thresholds.characterMinGap,
    consistencyPercent: thresholds.characterConsistencyPercent,
  });
  insights.push(
    ...getStudentOutliers(attorneys, "Attorney", {
      minCount: thresholds.studentMinCount,
      cohortMinCount: thresholds.studentCohortMinCount,
      minGap: thresholds.studentMinGap,
      consistencyPercent: thresholds.studentConsistencyPercent,
    }),
  );
  insights.push(
    ...getStudentOutliers(witnesses, "Witness", {
      minCount: thresholds.studentMinCount,
      cohortMinCount: thresholds.studentCohortMinCount,
      minGap: thresholds.studentMinGap,
      consistencyPercent: thresholds.studentConsistencyPercent,
    }),
  );

  if (!insights.length) {
    insights.push({
      title: "No clear pattern crossed the guide thresholds",
      direction: "neutral",
      body: "Smaller differences may still matter; this does not mean results were identical.",
      chart: "Review the charts below",
    });
  }

  return insights;
}
