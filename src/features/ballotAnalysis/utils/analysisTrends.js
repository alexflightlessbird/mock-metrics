const UNKNOWN_WITNESS_TYPE = "Unknown witness type";

function toFiniteScore(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" && value.trim() === "") return null;

  const score = Number(value);
  return Number.isFinite(score) ? score : null;
}

function getOrCreateGroup(groups, key, details) {
  if (!groups.has(key)) {
    groups.set(key, {
      ...details,
      directTotal: 0,
      directCount: 0,
      crossTotal: 0,
      crossCount: 0,
    });
  }

  return groups.get(key);
}

function addScore(group, metric, value) {
  const score = toFiniteScore(value);
  if (score === null) return;

  const totalKey = `${metric}Total`;
  const countKey = `${metric}Count`;
  group[totalKey] += score;
  group[countKey] += 1;
}

function finalizeGroups(groups) {
  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      directAverage:
        group.directCount > 0 ? group.directTotal / group.directCount : null,
      crossAverage:
        group.crossCount > 0 ? group.crossTotal / group.crossCount : null,
    }))
    .sort((a, b) =>
      (a.label || "").localeCompare(b.label || "", undefined, {
        sensitivity: "base",
      }),
    );
}

function cleanLabel(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeSide(side, pSideLabel = "Plaintiff/Prosecution") {
  if (typeof side === "string") {
    const normalizedSide = side.toLowerCase();
    if (normalizedSide === "p") return pSideLabel;
    if (normalizedSide === "d") return "Defense";
    if (normalizedSide === "s") return "Swing";
  }

  return cleanLabel(side, "Unknown side");
}

export function calculateAnalysisTrends({ attorneys = [], witnesses = [] }) {
  const attorneyByWitness = new Map();
  const attorneyByWitnessType = new Map();
  const attorneyByWitnessTypeAndSide = new Map();
  const attorneyBySide = new Map();
  const witnessBySide = new Map();
  const witnessByType = new Map();
  const witnessByTypeAndSide = new Map();
  const witnessByCharacter = new Map();

  attorneys.forEach((attorney) => {
    (attorney.scores || []).forEach((score) => {
      ["direct", "cross"].forEach((metric) => {
        const scoreEntry = score?.[metric];
        const value = toFiniteScore(scoreEntry?.score);
        if (value === null) return;
        const side = score.sideLabel || normalizeSide(
          attorney.side,
          attorney.pSideLabel,
        );

        const sideGroup = getOrCreateGroup(attorneyBySide, side, { label: side });
        addScore(sideGroup, metric, value);

        const witness = scoreEntry?.witness;
        const witnessType = cleanLabel(witness?.type, UNKNOWN_WITNESS_TYPE);
        const typeGroup = getOrCreateGroup(attorneyByWitnessType, witnessType, {
          label: witnessType,
          type: witnessType,
        });
        addScore(typeGroup, metric, value);

        const typeAndSideKey = JSON.stringify([witnessType, side]);
        const typeAndSideGroup = getOrCreateGroup(
          attorneyByWitnessTypeAndSide,
          typeAndSideKey,
          {
            label: `${witnessType} · ${side}`,
            type: witnessType,
            side,
          },
        );
        addScore(typeAndSideGroup, metric, value);

        if (witness?.id !== null && witness?.id !== undefined) {
          const witnessId = String(witness.id);
          const witnessLabel = cleanLabel(witness.name, "Unnamed witness");
          const witnessGroup = getOrCreateGroup(
            attorneyByWitness,
            witnessId,
            {
              id: witnessId,
              label: witnessLabel,
              type: witnessType,
              side:
                (metric === "direct"
                  ? score.directWitnessSideLabel
                  : score.crossWitnessSideLabel) ||
                normalizeSide(witness.side, attorney.pSideLabel),
            },
          );
          addScore(witnessGroup, metric, value);
        }
      });
    });
  });

  witnesses.forEach((witnessEntry) => {
    (witnessEntry.scores || []).forEach((score) => {
      const directScore = toFiniteScore(score?.direct?.score);
      const crossScore = toFiniteScore(score?.cross?.score);
      if (directScore === null && crossScore === null) return;
      const side =
        score.sideLabel ||
        normalizeSide(witnessEntry.side, witnessEntry.pSideLabel);

      const witnessType = cleanLabel(
        score?.witness?.type,
        UNKNOWN_WITNESS_TYPE,
      );
      const typeGroup = getOrCreateGroup(witnessByType, witnessType, {
        label: witnessType,
        type: witnessType,
      });
      const sideGroup = getOrCreateGroup(witnessBySide, side, {
        label: side,
        side,
      });
      const typeAndSideGroup = getOrCreateGroup(
        witnessByTypeAndSide,
        JSON.stringify([witnessType, side]),
        {
          label: `${witnessType} · ${side}`,
          type: witnessType,
          side,
        },
      );

      addScore(typeGroup, "direct", directScore);
      addScore(typeGroup, "cross", crossScore);
      addScore(sideGroup, "direct", directScore);
      addScore(sideGroup, "cross", crossScore);
      addScore(typeAndSideGroup, "direct", directScore);
      addScore(typeAndSideGroup, "cross", crossScore);

      if (score?.witness?.id !== null && score?.witness?.id !== undefined) {
        const witnessId = String(score.witness.id);
        const characterGroup = getOrCreateGroup(
          witnessByCharacter,
          witnessId,
          {
            id: witnessId,
            label: cleanLabel(score.witness.name, "Unnamed witness"),
            type: witnessType,
            side:
              score.witnessSideLabel ||
              normalizeSide(score.witness.side, witnessEntry.pSideLabel),
          },
        );
        addScore(characterGroup, "direct", directScore);
        addScore(characterGroup, "cross", crossScore);
      }
    });
  });

  return {
    attorneyByWitness: finalizeGroups(attorneyByWitness),
    attorneyByWitnessType: finalizeGroups(attorneyByWitnessType),
    attorneyByWitnessTypeAndSide: finalizeGroups(
      attorneyByWitnessTypeAndSide,
    ),
    attorneyBySide: finalizeGroups(attorneyBySide),
    witnessBySide: finalizeGroups(witnessBySide),
    witnessByType: finalizeGroups(witnessByType),
    witnessByTypeAndSide: finalizeGroups(witnessByTypeAndSide),
    witnessByCharacter: finalizeGroups(witnessByCharacter),
  };
}
