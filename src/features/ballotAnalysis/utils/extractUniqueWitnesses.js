export default function extractUniqueWitnesses(allScores, type) {
  const witnessesMap = new Map();

  if (type === "attorney") {
    allScores.forEach((attorney) => {
      attorney.scores.forEach((score) => {
        if (score.direct?.witness?.id && score.direct?.witness?.name) {
          const witness = score.direct.witness;
          if (!witnessesMap.has(witness.id)) {
            witnessesMap.set(witness.id, {
              id: witness.id,
              name: witness.name,
              type: witness.type || "Unknown",
              side: witness.side || "Unknown",
            });
          }
        }

        if (score.cross?.witness?.id && score.cross?.witness?.name) {
          const witness = score.cross.witness;
          if (!witnessesMap.has(witness.id)) {
            witnessesMap.set(witness.id, {
              id: witness.id,
              name: witness.name,
              type: witness.type || "Unknown",
              side: witness.side || "Unknown",
            });
          }
        }
      });
    });
  } else if (type === "witness") {
    allScores.forEach((witness) => {
      witness.scores.forEach((score) => {
        if (score.witness?.id && score.witness?.name) {
          const w = score.witness;
          if (!witnessesMap.has(w.id)) {
            witnessesMap.set(w.id, {
              id: w.id,
              name: w.name,
              type: w.type || "Unknown",
              side: w.side || "Unknown",
            });
          }
        }
      });
    });
  }

  return Array.from(witnessesMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}
