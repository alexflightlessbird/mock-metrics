import roundScoresCalculator from "./roundScores";

export default function tournamentTeamScores({ team }) {
  const rounds = team.rounds;

  const pRounds = rounds.filter((r) => r.side === "p");
  const dRounds = rounds.filter((r) => r.side === "d");

  const pScores = pRounds.map((round) => {
    const roundCalculations = roundScoresCalculator({
      role_rounds: round.role_rounds,
      calculations: round.calculations,
      side: round.side,
      witness_rounds: round.witness_rounds,
    });

    const attorneys = roundCalculations.attorneys;
    const witnesses = roundCalculations.witnesses;

    return { attorneys, witnesses };
  });

  const dScores = dRounds.map((round) => {
    const roundCalculations = roundScoresCalculator({
      role_rounds: round.role_rounds,
      calculations: round.calculations,
      side: round.side,
      witness_rounds: round.witness_rounds,
    });

    const attorneys = roundCalculations.attorneys;
    const witnesses = roundCalculations.witnesses;

    return { attorneys, witnesses };
  });

  const pAttorneyScores = Object.values(
    pScores
      .flatMap((round) => round.attorneys)
      .reduce((grouped, attorney) => {
        const studentId = attorney.student.id;

        if (!grouped[studentId]) {
          grouped[studentId] = {
            student: attorney.student,
            side: "p",
            scores: [],
          };
        }

        grouped[studentId].scores.push(attorney.calculations);

        return grouped;
      }, {})
  );

  pAttorneyScores.map((attorneyScore) => {
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

  const pWitnessScores = Object.values(
    pScores
      .flatMap((round) => round.witnesses)
      .reduce((grouped, witness) => {
        const studentId = witness.student.id;

        if (!grouped[studentId]) {
          grouped[studentId] = {
            student: witness.student,
            side: "p",
            scores: [],
          };
        }

        grouped[studentId].scores.push(witness.calculations);

        return grouped;
      }, {})
  );

  pWitnessScores.map((witnessScore) => {
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

  const dAttorneyScores = Object.values(
    dScores
      .flatMap((round) => round.attorneys)
      .reduce((grouped, attorney) => {
        const studentId = attorney.student.id;

        if (!grouped[studentId]) {
          grouped[studentId] = {
            student: attorney.student,
            side: "d",
            scores: [],
          };
        }

        grouped[studentId].scores.push(attorney.calculations);

        return grouped;
      }, {})
  );

  dAttorneyScores.map((attorneyScore) => {
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

  const dWitnessScores = Object.values(
    dScores
      .flatMap((round) => round.witnesses)
      .reduce((grouped, witness) => {
        const studentId = witness.student.id;

        if (!grouped[studentId]) {
          grouped[studentId] = {
            student: witness.student,
            side: "d",
            scores: [],
          };
        }

        grouped[studentId].scores.push(witness.calculations);

        return grouped;
      }, {})
  );

  dWitnessScores.map((witnessScore) => {
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
    pAttorneyScores,
    pWitnessScores,
    dAttorneyScores,
    dWitnessScores,
  };
}
