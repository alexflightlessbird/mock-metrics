export function attorneyScoresByWitness(scoresArray) {
  const directScores = scoresArray.map((s) => s.direct);
  const crossScores = scoresArray.map((s) => s.cross);
  const speechScores = scoresArray.map((s) => s.speech);

  const directByWitness = Object.values(
    directScores.reduce((acc, direct) => {
      if (!direct || !direct?.witness?.id || !direct?.score) return acc;

      const witnessId = direct.witness.id;
      if (!acc[witnessId]) {
        acc[witnessId] = {
          witness: direct.witness,
          scores: [],
        };
      }
      acc[witnessId].scores.push(direct.score);
      return acc;
    }, {})
  );

  directByWitness.forEach((d) => {
    const rounds = d.scores.length;
    const average = d.scores.reduce((sum, s) => sum + s, 0) / rounds;
    d.average = parseFloat(average.toFixed(4));
    d.rounds = rounds;
    d.max = Math.max(...d.scores);
    d.min = Math.min(...d.scores);
  });

  const crossByWitness = Object.values(
    crossScores.reduce((acc, cross) => {
      if (!cross || !cross?.witness?.id || !cross?.score) return acc;

      const witnessId = cross.witness.id;
      if (!acc[witnessId]) {
        acc[witnessId] = {
          witness: cross.witness,
          scores: [],
        };
      }
      acc[witnessId].scores.push(cross.score);
      return acc;
    }, {})
  );

  crossByWitness.forEach((c) => {
    const rounds = c.scores.length;
    const average = c.scores.reduce((sum, s) => sum + s, 0) / rounds;
    c.average = parseFloat(average.toFixed(4));
    c.rounds = rounds;
    c.max = Math.max(...c.scores);
    c.min = Math.min(...c.scores);
  });

  const speechByType = Object.values(
    speechScores.reduce((acc, speech) => {
      if (!speech || !speech?.type || !speech?.score) return acc;

      const type = speech.type;
      if (!acc[type]) {
        acc[type] = {
          type: type,
          scores: [],
        };
      }
      acc[type].scores.push(speech.score);
      return acc;
    }, {})
  );

  speechByType.forEach((s) => {
    const rounds = s.scores.length;
    const average = s.scores.reduce((sum, s) => sum + s, 0) / rounds;
    s.average = parseFloat(average.toFixed(4));
    s.rounds = rounds;
    s.max = Math.max(...s.scores);
    s.min = Math.min(...s.scores);
  });

  return {
    directByWitness,
    crossByWitness,
    speechByType,
  };
}

export function witnessScoresByWitness(scoresArray) {
  const witnessGroups = scoresArray.reduce((acc, scoreObj) => {
    if (
      !scoreObj.witness?.id ||
      !scoreObj.direct?.score ||
      !scoreObj.cross?.score
    )
      return acc;

    const witnessId = scoreObj.witness.id;

    if (!acc[witnessId]) {
      acc[witnessId] = {
        witness: scoreObj.witness,
        directScores: [],
        crossScores: [],
      };
    }

    if (scoreObj.direct && typeof scoreObj.direct.score === "number") {
      acc[witnessId].directScores.push(scoreObj.direct.score);
    }

    if (scoreObj.cross && typeof scoreObj.cross.score === "number") {
      acc[witnessId].crossScores.push(scoreObj.cross.score);
    }

    return acc;
  }, {});

  const directByWitness = Object.values(witnessGroups).map((witnessGroup) => {
    const scores = witnessGroup.directScores;
    const rounds = scores.length;
    const average =
      rounds > 0 ? scores.reduce((sum, s) => sum + s, 0) / rounds : 0;

    return {
      witness: witnessGroup.witness,
      scores: scores,
      average: parseFloat(average.toFixed(4)),
      rounds: rounds,
      max: rounds > 0 ? Math.max(...scores) : 0,
      min: rounds > 0 ? Math.min(...scores) : 0,
    };
  });

  const crossByWitness = Object.values(witnessGroups).map((witnessGroup) => {
    const scores = witnessGroup.crossScores;
    const rounds = scores.length;
    const average =
      rounds > 0 ? scores.reduce((sum, s) => sum + s, 0) / rounds : 0;

    return {
      witness: witnessGroup.witness,
      scores: scores,
      average: parseFloat(average.toFixed(4)),
      rounds: rounds,
      max: rounds > 0 ? Math.max(...scores) : 0,
      min: rounds > 0 ? Math.min(...scores) : 0,
    };
  });

  return {
    directByWitness,
    crossByWitness,
  };
}
