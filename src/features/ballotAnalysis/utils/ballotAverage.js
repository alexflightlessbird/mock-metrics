export default function ballotAverage(scores) {
  if (scores.length !== 28) {
    throw new Error("Expected 28 scores for a full ballot");
  }

  const pTotal = scores
    .filter((s) => s.score_type.startsWith("p"))
    .reduce((sum, s) => sum + Number(s.score_value), 0);
  const dTotal = scores
    .filter((s) => s.score_type.startsWith("d"))
    .reduce((sum, s) => sum + Number(s.score_value), 0);

  const pAverage = pTotal / 14;
  const dAverage = dTotal / 14;

  const overallTotal = pTotal + dTotal;
  const overallAverage = overallTotal / 28;

  return {
    pTotal,
    pAverage,
    dTotal,
    dAverage,
    overallTotal,
    overallAverage,
  };
}
