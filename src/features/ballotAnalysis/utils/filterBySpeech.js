export function filterAttorneysBySpeech(attorneyScoresArray, filters = {}) {
  const { speechTypes = [] } = filters;

  const hasSpeechTypeFilter = speechTypes.length > 0;

  if (!hasSpeechTypeFilter) return attorneyScoresArray;

  return attorneyScoresArray
    .map((attorney) => {
      const filteredScores = attorney.scores
        .map((score) => {
          const filteredScore = { ...score };

          if (score.speech?.type) {
            const matchesSpeechType = speechTypes.includes(score.speech.type);

            if (matchesSpeechType) {
              filteredScore.speech = score.speech;
            } else {
              filteredScore.speech = { score: null, type: null };
            }
          }

          filteredScore.direct = score.direct;
          filteredScore.cross = score.cross;

          const hasValidSpeech =
            filteredScore.speech?.score !== null &&
            filteredScore.speech?.score !== undefined;

          return hasValidSpeech ? filteredScore : null;
        })
        .filter(Boolean);

      if (filteredScores.length === 0) return null;

      const validSpeechScores = filteredScores.filter(
        (s) => s.speech?.score !== null && s.speech?.score !== undefined,
      );

      const recalculated = {
        ...attorney,
        scores: filteredScores,
      };

      recalculated.averageSpeech =
        validSpeechScores.length > 0
          ? parseFloat(
              (
                validSpeechScores.reduce(
                  (sum, calc) => sum + (calc.speech?.score || 0),
                  0,
                ) / validSpeechScores.length
              ).toFixed(4),
            )
          : null;

      return recalculated;
    })
    .filter(Boolean);
}
