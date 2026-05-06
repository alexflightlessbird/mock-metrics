export function filterAttorneysBySpeech(attorneyScoresArray, filters = {}) {
  const { speechTypes = [] } = filters;

  const hasSpeechTypeFilter = speechTypes.length > 0;

  const includeNone = speechTypes.includes("none");
  const includeOpen = speechTypes.includes("open");
  const includeClose = speechTypes.includes("close");

  if (!hasSpeechTypeFilter) return attorneyScoresArray;

  return attorneyScoresArray
    .map((attorney) => {
      const openScores = [];
      const closeScores = [];
      const noneScores = [];

      attorney.scores.forEach((score) => {
        if (score.speech?.type === "open") {
          openScores.push(score);
        } else if (score.speech?.type === "close") {
          closeScores.push(score);
        } else if (!score.speech?.type || score.speech?.type === null) {
          noneScores.push(score);
        }
      });

      let filteredScores = [];

      if (includeOpen) filteredScores.push(...openScores);
      if (includeClose) filteredScores.push(...closeScores);
      if (includeNone) filteredScores.push(...noneScores);

      if (filteredScores.length === 0) return null;

      const recalculated = {
        ...attorney,
        scores: filteredScores,
      };

      const validSpeechScores = filteredScores.filter(
        (s) => s.speech?.score !== null && s.speech?.score !== undefined,
      );

      if (
        includeNone &&
        !includeOpen &&
        !includeClose &&
        validSpeechScores.length === 0
      )
        recalculated.averageSpeech = null;
      else if (validSpeechScores.length > 0) {
        recalculated.averageSpeech = parseFloat(
          (
            validSpeechScores.reduce(
              (sum, calc) => sum + (calc.speech?.score || 0),
              0,
            ) / validSpeechScores.length
          ).toFixed(4),
        );
      } else {
        recalculated.averageSpeech = null;
      }

      return recalculated;
    })
    .filter(Boolean);
}
