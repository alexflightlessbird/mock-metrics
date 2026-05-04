export function filterAttorneysByWitness(attorneyScoresArray, filters = {}) {
  const { witnessTypes = [], witnessIds = [] } = filters;

  const hasTypeFilter = witnessTypes.length > 0;
  const hasWitnessFilter = witnessIds.length > 0;

  if (!hasTypeFilter && !hasWitnessFilter) return attorneyScoresArray;

  return attorneyScoresArray
    .map((attorney) => {
      const filteredScores = attorney.scores
        .map((score) => {
          const filteredScore = { ...score };

          if (score.direct?.witness?.id) {
            const matchesType =
              !hasTypeFilter ||
              witnessTypes.includes(score.direct.witness.type);
            const matchesWitness =
              !hasWitnessFilter || witnessIds.includes(score.direct.witness.id);

            if (matchesType && matchesWitness) {
              filteredScore.direct = score.direct;
            } else {
              filteredScore.direct = { score: null, witness: null };
            }
          }

          if (score.cross?.witness?.id) {
            const matchesType =
              !hasTypeFilter || witnessTypes.includes(score.cross.witness.type);
            const matchesWitness =
              !hasWitnessFilter || witnessIds.includes(score.cross.witness.id);

            if (matchesType && matchesWitness) {
              filteredScore.cross = score.cross;
            } else {
              filteredScore.cross = { score: null, witness: null };
            }
          }

          filteredScore.speech = score.speech;

          const hasValidDirect =
            filteredScore.direct?.score !== null &&
            filteredScore.direct?.score !== undefined;
          const hasValidCross =
            filteredScore.cross?.score !== null &&
            filteredScore.cross?.score !== undefined;

          return hasValidDirect || hasValidCross ? filteredScore : null;
        })
        .filter(Boolean);

      if (filteredScores.length === 0) return null;

      const validDirectScores = filteredScores.filter(
        (s) => s.direct?.score !== null && s.direct?.score !== undefined,
      );
      const validCrossScores = filteredScores.filter(
        (s) => s.cross?.score !== null && s.cross?.score !== undefined,
      );

      const recalculated = {
        ...attorney,
        scores: filteredScores,
      };

      recalculated.averageDirect =
        validDirectScores.length > 0
          ? parseFloat(
              (
                validDirectScores.reduce(
                  (sum, calc) => sum + (calc.direct?.score || 0),
                  0,
                ) / validDirectScores.length
              ).toFixed(4),
            )
          : null;

      recalculated.averageCross =
        validCrossScores.length > 0
          ? parseFloat(
              (
                validCrossScores.reduce(
                  (sum, calc) => sum + (calc.cross?.score || 0),
                  0,
                ) / validCrossScores.length
              ).toFixed(4),
            )
          : null;

      if (
        recalculated.averageDirect !== null &&
        recalculated.averageCross !== null
      ) {
        recalculated.average = parseFloat(
          (
            (recalculated.averageDirect + recalculated.averageCross) /
            2
          ).toFixed(2),
        );
      } else if (recalculated.averageDirect !== null) {
        recalculated.average = recalculated.averageDirect.toFixed(2);
      } else if (recalculated.averageCross !== null) {
        recalculated.average = recalculated.averageCross.toFixed(2);
      } else {
        recalculated.average = null;
      }

      recalculated.averageSpeech = filteredScores.some(
        (calc) => calc.speech?.score !== null,
      )
        ? parseFloat(
            (
              filteredScores.reduce(
                (sum, calc) => sum + (calc.speech?.score || 0),
                0,
              ) /
                filteredScores.filter(
                  (s) =>
                    s.speech?.score !== null && s.speech?.score !== undefined,
                ).length || 1
            ).toFixed(4),
          )
        : null;

      return recalculated;
    })
    .filter(Boolean);
}

export function filterWitnessesByWitness(witnessScoresArray, filters = {}) {
  const { witnessTypes = [], witnessIds = [] } = filters;

  const hasTypeFilter = witnessTypes.length > 0;
  const hasIdFilter = witnessIds.length > 0;

  if (!hasTypeFilter && !hasIdFilter) return witnessScoresArray;

  return witnessScoresArray
    .map((witness) => {
      const filteredScores = witness.scores.filter((score) => {
        if (!score.witness?.id) return false;

        const matchesType =
          !hasTypeFilter || witnessTypes.includes(score.witness.type);
        const matchesWitness =
          !hasIdFilter || witnessIds.includes(score.witness.id);

        return matchesType && matchesWitness;
      });

      if (filteredScores.length === 0) return null;

      const validDirectScores = filteredScores.filter(
        (s) => s.direct?.score !== null && s.direct?.score !== undefined,
      );
      const validCrossScores = filteredScores.filter(
        (s) => s.cross?.score !== null && s.cross?.score !== undefined,
      );

      const recalculated = {
        ...witness,
        scores: filteredScores,
      };

      recalculated.averageDirect =
        validDirectScores.length > 0
          ? parseFloat(
              (
                validDirectScores.reduce(
                  (sum, calc) => sum + (calc.direct?.score || 0),
                  0,
                ) / validDirectScores.length
              ).toFixed(4),
            )
          : null;

      recalculated.averageCross =
        validCrossScores.length > 0
          ? parseFloat(
              (
                validCrossScores.reduce(
                  (sum, calc) => sum + (calc.cross?.score || 0),
                  0,
                ) / validCrossScores.length
              ).toFixed(4),
            )
          : null;

      if (
        recalculated.averageDirect !== null &&
        recalculated.averageCross !== null
      ) {
        recalculated.average = parseFloat(
          (
            (recalculated.averageDirect + recalculated.averageCross) /
            2
          ).toFixed(2),
        );
      } else if (recalculated.averageDirect !== null) {
        recalculated.average = recalculated.averageDirect.toFixed(2);
      } else if (recalculated.averageCross !== null) {
        recalculated.average = recalculated.averageCross.toFixed(2);
      } else {
        recalculated.average = null;
      }

      return recalculated;
    })
    .filter(Boolean);
}
