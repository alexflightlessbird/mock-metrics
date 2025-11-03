export default function overallScores({ tournaments }) {
  const attorneys = tournaments.map((t) => t.calculations.attorneys).flat();
  const witnesses = tournaments.map((t) => t.calculations.witnesses).flat();

  // group attorneys by their team ID first, then merge their scores for that team. If a student competed on multiple teams, their scores should not be merged between teams
  const groupedAttorneys = Object.values(
    attorneys.reduce((grouped, attorney) => {
      const key = `${attorney.student.id}-${attorney.teamId}-${attorney.side}`;

      if (!grouped[key]) {
        grouped[key] = {
          student: attorney.student,
          teamId: attorney.teamId,
          teamName: attorney.teamName,
          side: attorney.side,
          scores: [],
        };
      }

      grouped[key].scores.push(...attorney.scores);

      return grouped;
    }, {})
  );

  const groupedWitnesses = Object.values(
    witnesses.reduce((grouped, witness) => {
      const key = `${witness.student.id}-${witness.teamId}-${witness.side}`;

      if (!grouped[key]) {
        grouped[key] = {
          student: witness.student,
          teamId: witness.teamId,
          teamName: witness.teamName,
          side: witness.side,
          scores: [],
        };
      }

      grouped[key].scores.push(...witness.scores);

      return grouped;
    }, {})
  );

  groupedAttorneys.map((attorneyScore) => {
    attorneyScore.averageDirect = parseFloat(
      (
        attorneyScore.scores.reduce((sum, calc) => sum + calc.direct.score, 0) /
        attorneyScore.scores.length
      ).toFixed(4)
    );
    attorneyScore.averageCross = parseFloat(
      (
        attorneyScore.scores.reduce((sum, calc) => sum + calc.cross.score, 0) /
        attorneyScore.scores.length
      ).toFixed(4)
    );
    attorneyScore.average = parseFloat(
      ((attorneyScore.averageDirect + attorneyScore.averageCross) / 2).toFixed(
        2
      )
    );
    attorneyScore.averageSpeech = attorneyScore.scores.some(
      (calc) => calc.speech.score !== null
    )
      ? parseFloat(
          (
            attorneyScore.scores.reduce(
              (sum, calc) => sum + calc.speech.score,
              0
            ) / attorneyScore.scores.length
          ).toFixed(4)
        )
      : null;
  });

  groupedWitnesses.map((witnessScore) => {
    witnessScore.averageDirect = parseFloat(
      (
        witnessScore.scores.reduce((sum, calc) => sum + calc.direct.score, 0) /
        witnessScore.scores.length
      ).toFixed(4)
    );
    witnessScore.averageCross = parseFloat(
      (
        witnessScore.scores.reduce((sum, calc) => sum + calc.cross.score, 0) /
        witnessScore.scores.length
      ).toFixed(4)
    );
    witnessScore.average = parseFloat(
      ((witnessScore.averageDirect + witnessScore.averageCross) / 2).toFixed(2)
    );
  });

  return {
    attorneys: groupedAttorneys,
    witnesses: groupedWitnesses,
  };
}
