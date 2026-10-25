const ATTORNEY_ROLES = new Set([
  "p1",
  "p2",
  "p5",
  "p8",
  "p11",
  "p12",
  "p13",
  "p14",
  "d1",
  "d2",
  "d3",
  "d4",
  "d5",
  "d8",
  "d11",
  "d14",
]);

const WITNESS_ROLES = new Set([
  "p3",
  "p4",
  "p6",
  "p7",
  "p9",
  "p10",
  "d6",
  "d7",
  "d9",
  "d10",
  "d12",
  "d13",
]);

const ATTORNEY_DIRECT = new Set([
  "p2",
  "p5",
  "p8",
  "d5",
  "d8",
  "d11",
]);

const ATTORNEY_CROSS = new Set([
  "p11",
  "p12",
  "p13",
  "d2",
  "d3",
  "d4",
]);

const WITNESS_DIRECT = new Set([
  "p3",
  "p6",
  "p9",
  "d6",
  "d9",
  "d12",
]);

const WITNESS_CROSS = new Set([
  "p4",
  "p7",
  "p10",
  "d7",
  "d10",
  "d13",
]);

const DIRECTED_WITNESS_ROLE = {
  p2: "p1",
  p5: "p2",
  p8: "p3",
  d5: "d1",
  d8: "d2",
  d11: "d3",
};

const CROSSED_WITNESS_ROLE = {
  p11: "d1",
  p12: "d2",
  p13: "d3",
  d2: "p1",
  d3: "p2",
  d4: "p3",
};

const TESTIFIED_WITNESS_ROLE = {
  p3: "p1",
  p4: "p1",
  p6: "p2",
  p7: "p2",
  p9: "p3",
  p10: "p3",
  d6: "d1",
  d7: "d1",
  d9: "d2",
  d10: "d2",
  d12: "d3",
  d13: "d3",
};

function relatedRecord(value) {
  return Array.isArray(value) ? value[0] : value;
}

function finiteNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function getRoleType(record) {
  return record.role_type || record.roleType;
}

function getRoleCategory(roleType) {
  if (ATTORNEY_ROLES.has(roleType)) return "Attorney";
  if (WITNESS_ROLES.has(roleType)) return "Witness";
  return null;
}

function getTechnique(roleType) {
  if (ATTORNEY_DIRECT.has(roleType) || WITNESS_DIRECT.has(roleType))
    return "Direct";
  if (ATTORNEY_CROSS.has(roleType) || WITNESS_CROSS.has(roleType))
    return "Cross";
  return null;
}

function getSpeechType(roleType) {
  if (roleType === "p1" || roleType === "d1") return "Opening";
  if (roleType === "p14" || roleType === "d14") return "Closing";
  return null;
}

function getActivity(roleType) {
  return getTechnique(roleType) || getSpeechType(roleType);
}

function getSideLabel(side, caseType) {
  if (side === "p") {
    if (caseType === "civil") return "Plaintiff";
    if (caseType === "criminal") return "Prosecution";
    return "Plaintiff/Prosecution";
  }
  if (side === "d") return "Defense";
  if (side === "s") return "Swing";
  return side || "Unknown";
}

function getWitnessType(round, roleType) {
  const witnessRole =
    DIRECTED_WITNESS_ROLE[roleType] ||
    CROSSED_WITNESS_ROLE[roleType] ||
    TESTIFIED_WITNESS_ROLE[roleType];
  if (!witnessRole) return null;

  const witnessRound = round.witness_rounds?.find(
    (assignment) => assignment.role_type === witnessRole,
  );
  return (
    relatedRecord(witnessRound?.witnesses)?.type ||
    relatedRecord(witnessRound?.witness)?.type ||
    null
  );
}

function average(values) {
  const validValues = values.filter(Number.isFinite);
  if (validValues.length === 0) return null;
  return validValues.reduce((sum, value) => sum + value, 0) / validValues.length;
}

function weightedAverage(entries) {
  const weightedEntries = entries.filter(
    (entry) =>
      Number.isFinite(entry.value) &&
      Number.isFinite(entry.weight) &&
      entry.weight > 0,
  );
  const totalWeight = weightedEntries.reduce(
    (sum, entry) => sum + entry.weight,
    0,
  );
  if (totalWeight === 0) return null;
  return (
    weightedEntries.reduce(
      (sum, entry) => sum + entry.value * entry.weight,
      0,
    ) / totalWeight
  );
}

function summarize(observations) {
  const weightedScore = weightedAverage(
    observations.map((item) => ({ value: item.score, weight: item.weight })),
  );
  return {
    average: weightedScore,
    count: observations.length,
  };
}

function summarizeBy(observations, getKey) {
  const groups = new Map();
  observations.forEach((observation) => {
    const key = getKey(observation);
    if (!key) return;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(observation);
  });

  return Array.from(groups, ([label, values]) => ({
    label,
    ...summarize(values),
  })).sort((a, b) => a.label.localeCompare(b.label));
}

function normalizeRounds(records, studentId) {
  const roundsById = new Map();
  records.forEach((record) => {
    const round = relatedRecord(record.rounds);
    if (!round?.id) return;

    if (!roundsById.has(round.id)) {
      const tournament = relatedRecord(round.tournaments);
      const caseDetails = relatedRecord(tournament?.cases);
      roundsById.set(round.id, {
        ...round,
        tournament,
        caseType: caseDetails?.type,
        studentRoleTypes: new Set(),
        roles: [],
      });
    }

    const normalizedRound = roundsById.get(round.id);
    const roleType = getRoleType(record);
    if (roleType && !normalizedRound.studentRoleTypes.has(roleType)) {
      normalizedRound.studentRoleTypes.add(roleType);
      normalizedRound.roles.push(roleType);
    }

    (round.role_rounds || [])
      .filter(
        (assignment) =>
          assignment.student_id === studentId &&
          assignment.role_type &&
          !normalizedRound.studentRoleTypes.has(assignment.role_type),
      )
      .forEach((assignment) => {
        normalizedRound.studentRoleTypes.add(assignment.role_type);
        normalizedRound.roles.push(assignment.role_type);
      });
  });

  return Array.from(roundsById.values());
}

export function calculateStudentPerformance(records = [], studentId) {
  const rounds = normalizeRounds(records, studentId);
  const observations = [];

  rounds.forEach((round) => {
    const side = round.side || round.roles[0]?.[0];
    const sideLabel = getSideLabel(side, round.caseType);

    (round.ballots || []).forEach((ballot) => {
      const scores = (ballot.scores || [])
        .map((score) => ({
          ...score,
          value: finiteNumber(score.score_value),
          weight: finiteNumber(score.weight) ?? 1,
        }))
        .filter((score) => score.value !== null);
      const ballotAverage = average(scores.map((score) => score.value));
      if (ballotAverage === null) return;

      round.roles.forEach((roleType) => {
        const roleCategory = getRoleCategory(roleType);
        if (!roleCategory) return;

        const matchingScores = scores
          .filter((score) => score.score_type === roleType)
          .map((score) => ({ value: score.value, weight: score.weight }));
        const rawScore = weightedAverage(matchingScores);
        if (rawScore === null) return;
        const observationWeight = matchingScores.reduce(
          (sum, score) => sum + score.weight,
          0,
        );
        observations.push({
          score: rawScore - ballotAverage,
          weight: observationWeight,
          role: roleCategory,
          technique: getTechnique(roleType),
          speech: getSpeechType(roleType),
          activity: getActivity(roleType),
          side: sideLabel,
          witnessType: getWitnessType(round, roleType),
          tournamentId: round.tournament?.id || round.tournament_id,
          tournamentName: round.tournament?.name || "Unnamed tournament",
          tournamentDate: round.tournament?.start_date || null,
          roundId: round.id,
          roundNumber: round.round_number,
          roleType,
        });
      });
    });
  });

  const observationsByTournament = new Map();
  rounds.forEach((round) => {
    const tournamentId = round.tournament?.id || round.tournament_id;
    if (!tournamentId) return;
    if (!observationsByTournament.has(tournamentId)) {
      observationsByTournament.set(tournamentId, {
        id: tournamentId,
        name: round.tournament?.name || "Unnamed tournament",
        date: round.tournament?.start_date || null,
        rounds: new Map(),
      });
    }
    const tournament = observationsByTournament.get(tournamentId);
    tournament.rounds.set(round.id, round);
  });

  const tournamentSummaries = Array.from(observationsByTournament.values())
    .map((tournament) => {
      const tournamentObservations = observations.filter(
        (item) => item.tournamentId === tournament.id,
      );
      const recordedRounds = Array.from(tournament.rounds.values());
      const sideCounts = recordedRounds.reduce(
        (counts, round) => {
          if (round.side === "p" || round.side === "d")
            counts[round.side] += 1;
          return counts;
        },
        { p: 0, d: 0 },
      );
      const doubleSided =
        recordedRounds.length === 4 &&
        sideCounts.p === 2 &&
        sideCounts.d === 2;
      const roundsForTournament = recordedRounds
        .sort((a, b) => (a.round_number || 0) - (b.round_number || 0))
        .map((round) => {
          const roundObservations = observations.filter(
            (item) => item.roundId === round.id,
          );
          return {
            id: round.id,
            number: round.round_number,
            side: getSideLabel(round.side, round.caseType),
            roles: round.roles.map((role) => getRoleCategory(role)).filter(Boolean),
            average: summarize(roundObservations).average,
            count: roundObservations.length,
          };
        });

      return {
        ...tournament,
        doubleSided,
        rounds: roundsForTournament,
        ...summarize(tournamentObservations),
        opening: summarize(
          tournamentObservations.filter((item) => item.speech === "Opening"),
        ),
        closing: summarize(
          tournamentObservations.filter((item) => item.speech === "Closing"),
        ),
      };
    })
    .sort((a, b) => {
      const dateDifference =
        new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
      return dateDifference || a.name.localeCompare(b.name);
    });

  const tournamentTypeGroups = { "Double-sided": [], "Single-sided": [] };
  tournamentSummaries.forEach((tournament) => {
    tournamentTypeGroups[
      tournament.doubleSided ? "Double-sided" : "Single-sided"
    ].push(...observations.filter((item) => item.tournamentId === tournament.id));
  });

  return {
    rounds,
    observations,
    tournaments: tournamentSummaries,
    summary: {
      tournamentCount: tournamentSummaries.length,
      roundCount: rounds.length,
      observationCount: observations.length,
      average: summarize(observations).average,
    },
    byRole: summarizeBy(observations, (item) => item.role),
    bySide: summarizeBy(observations, (item) => item.side),
    byTechnique: summarizeBy(
      observations.filter((item) => item.technique),
      (item) => `${item.role} · ${item.technique}`,
    ),
    byWitnessType: summarizeBy(
      observations.filter((item) => item.witnessType),
      (item) => item.witnessType,
    ),
    byRoleAndWitnessType: summarizeBy(
      observations.filter((item) => item.witnessType),
      (item) => `${item.role} · ${item.witnessType}`,
    ),
    byRoleAndSide: summarizeBy(
      observations,
      (item) => `${item.role} · ${item.side}`,
    ),
    byActivityAndWitnessType: summarizeBy(
      observations.filter((item) => item.activity && item.witnessType),
      (item) => `${item.role} · ${item.activity} · ${item.witnessType}`,
    ),
    byTournamentType: Object.entries(tournamentTypeGroups).map(
      ([label, items]) => ({ label, ...summarize(items) }),
    ),
  };
}

const PERFORMANCE_GROUPS = {
  overall: () => "Overall",
  role: (item) => item.role,
  side: (item) => item.side,
  activity: (item) => item.activity,
  witnessType: (item) => item.witnessType || "Witness type not recorded",
  roleSide: (item) => `${item.role} · ${item.side}`,
  roleActivity: (item) =>
    item.activity ? `${item.role} · ${item.activity}` : null,
  roleWitnessType: (item) =>
    item.witnessType ? `${item.role} · ${item.witnessType}` : null,
  roleActivityWitnessType: (item) =>
    item.activity && item.witnessType
      ? `${item.role} · ${item.activity} · ${item.witnessType}`
      : null,
  roleSideActivityWitnessType: (item) =>
    item.activity && item.witnessType
      ? `${item.role} · ${item.side} · ${item.activity} · ${item.witnessType}`
      : null,
};

export function summarizeStudentPerformance(observations, groupBy) {
  const getGroup = PERFORMANCE_GROUPS[groupBy] || PERFORMANCE_GROUPS.overall;
  return summarizeBy(observations, getGroup);
}

export function buildStudentPerformanceTrend(observations, groupBy) {
  const getGroup = PERFORMANCE_GROUPS[groupBy] || PERFORMANCE_GROUPS.overall;
  const tournaments = new Map();

  observations.forEach((observation) => {
    const label = getGroup(observation);
    if (!label || !observation.tournamentId) return;

    if (!tournaments.has(observation.tournamentId)) {
      tournaments.set(observation.tournamentId, {
        id: observation.tournamentId,
        name: observation.tournamentName,
        date: observation.tournamentDate,
        groups: new Map(),
      });
    }

    const tournament = tournaments.get(observation.tournamentId);
    if (!tournament.groups.has(label)) tournament.groups.set(label, []);
    tournament.groups.get(label).push(observation);
  });

  const orderedTournaments = Array.from(tournaments.values()).sort((a, b) => {
    const dateDifference =
      new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
    return dateDifference || a.name.localeCompare(b.name);
  });
  const series = Array.from(
    new Set(orderedTournaments.flatMap((item) => Array.from(item.groups.keys()))),
  ).sort((a, b) => a.localeCompare(b));

  return {
    series,
    rows: orderedTournaments.map((tournament, index) => {
      const row = {
        tournamentId: tournament.id,
        name: tournament.name,
        date: tournament.date,
        order: index + 1,
      };
      series.forEach((label) => {
        const summary = summarize(tournament.groups.get(label) || []);
        row[label] = summary.average;
        row[`${label}Count`] = summary.count;
      });
      return row;
    }),
  };
}
