import ballotAverageCalc from "./ballotAverage";

export function directCalculation(oneToCalculate, ballot) {
  const ballotAverage = ballotAverageCalc(ballot.scores).overallAverage;
  const oneScore = ballot.scores.find(
    (s) => s.score_type === oneToCalculate
  ).score_value;

  const directAvg = (oneScore - ballotAverage).toFixed(2);

  let otherSideAvg = 0;

  if (oneToCalculate.startsWith("p")) {
    if (
      oneToCalculate === "p2" ||
      oneToCalculate === "p5" ||
      oneToCalculate === "p8"
    ) {
      const otherSideScore1 = ballot.scores.find((s) => s.score_type === "d5");
      const otherSideScore2 = ballot.scores.find((s) => s.score_type === "d8");
      const otherSideScore3 = ballot.scores.find((s) => s.score_type === "d11");

      otherSideAvg =
        (otherSideScore1.score_value +
          otherSideScore2.score_value +
          otherSideScore3.score_value) /
        3;
    } else if (
      oneToCalculate === "p3" ||
      oneToCalculate === "p6" ||
      oneToCalculate === "p9"
    ) {
      const otherSideScore1 = ballot.scores.find((s) => s.score_type === "d6");
      const otherSideScore2 = ballot.scores.find((s) => s.score_type === "d9");
      const otherSideScore3 = ballot.scores.find((s) => s.score_type === "d12");

      otherSideAvg =
        (otherSideScore1.score_value +
          otherSideScore2.score_value +
          otherSideScore3.score_value) /
        3;
    }
  } else if (oneToCalculate.startsWith("d")) {
    if (
      oneToCalculate === "d5" ||
      oneToCalculate === "d8" ||
      oneToCalculate === "d11"
    ) {
      const otherSideScore1 = ballot.scores.find((s) => s.score_type === "p2");
      const otherSideScore2 = ballot.scores.find((s) => s.score_type === "p5");
      const otherSideScore3 = ballot.scores.find((s) => s.score_type === "p8");

      otherSideAvg =
        (otherSideScore1.score_value +
          otherSideScore2.score_value +
          otherSideScore3.score_value) /
        3;
    } else if (
      oneToCalculate === "d6" ||
      oneToCalculate === "d9" ||
      oneToCalculate === "d12"
    ) {
      const otherSideScore1 = ballot.scores.find((s) => s.score_type === "p3");
      const otherSideScore2 = ballot.scores.find((s) => s.score_type === "p6");
      const otherSideScore3 = ballot.scores.find((s) => s.score_type === "p9");

      otherSideAvg =
        (otherSideScore1.score_value +
          otherSideScore2.score_value +
          otherSideScore3.score_value) /
        3;
    }
  }

  const directComp = oneScore - otherSideAvg.toFixed(2);

  return {
    directAvg,
    directComp,
  };
}

export function crossCalculation(oneToCalculate, ballot) {
  const ballotAverage = ballotAverageCalc(ballot.scores).overallAverage;
  const oneScore = ballot.scores.find(
    (s) => s.score_type === oneToCalculate
  ).score_value;

  const crossAvg = (oneScore - ballotAverage).toFixed(2);

  let otherSideComp = 0;

  switch (oneToCalculate) {
    case "p4":
      otherSideComp = ballot.scores.find(
        (s) => s.score_type === "d2"
      ).score_value;
      break;
    case "p7":
      otherSideComp = ballot.scores.find(
        (s) => s.score_type === "d3"
      ).score_value;
      break;
    case "p10":
      otherSideComp = ballot.scores.find(
        (s) => s.score_type === "d4"
      ).score_value;
      break;
    case "p11":
      otherSideComp = ballot.scores.find(
        (s) => s.score_type === "d7"
      ).score_value;
      break;
    case "p12":
      otherSideComp = ballot.scores.find(
        (s) => s.score_type === "d10"
      ).score_value;
      break;
    case "p13":
      otherSideComp = ballot.scores.find(
        (s) => s.score_type === "d13"
      ).score_value;
      break;
    case "d2":
      otherSideComp = ballot.scores.find(
        (s) => s.score_type === "p4"
      ).score_value;
      break;
    case "d3":
      otherSideComp = ballot.scores.find(
        (s) => s.score_type === "p7"
      ).score_value;
      break;
    case "d4":
      otherSideComp = ballot.scores.find(
        (s) => s.score_type === "p10"
      ).score_value;
      break;
    case "d7":
      otherSideComp = ballot.scores.find(
        (s) => s.score_type === "p11"
      ).score_value;
      break;
    case "d10":
      otherSideComp = ballot.scores.find(
        (s) => s.score_type === "p12"
      ).score_value;
      break;
    case "d13":
      otherSideComp = ballot.scores.find(
        (s) => s.score_type === "p13"
      ).score_value;
      break;
    default:
      otherSideComp = 0;
  }

  const crossComp = oneScore - otherSideComp;

  return {
    crossAvg,
    crossComp,
  };
}

export function speechCalculation(oneToCalculate, ballot) {
  const ballotAverage = ballotAverageCalc(ballot.scores).overallAverage;
  const oneScore = ballot.scores.find(
    (s) => s.score_type === oneToCalculate
  ).score_value;

  const speechAvg = (oneScore - ballotAverage).toFixed(2);

  let otherSideComp = 0;

  switch (oneToCalculate) {
    case "p1":
      otherSideComp = ballot.scores.find(
        (s) => s.score_type === "d1"
      ).score_value;
      break;
    case "p14":
      otherSideComp = ballot.scores.find(
        (s) => s.score_type === "d14"
      ).score_value;
      break;
    case "d1":
      otherSideComp = ballot.scores.find(
        (s) => s.score_type === "p1"
      ).score_value;
      break;
    case "d14":
      otherSideComp = ballot.scores.find(
        (s) => s.score_type === "p14"
      ).score_value;
      break;
    default:
      otherSideComp = 0;
  }

  const speechComp = oneScore - otherSideComp;

  return {
    speechAvg,
    speechComp,
  };
}

export function mergeCalculations({ avg, comp }) {
  if ((!avg && avg !== 0) || (!comp && comp !== 0)) return null;

  if (isNaN(avg) || isNaN(comp)) return null;

  avg = parseFloat(avg);
  comp = parseFloat(comp);

  if (comp < 0) {
    if (avg >= 0) return (avg / (1 + Math.abs(comp) / 100)).toFixed(4);
    else if (avg < 0) return (avg * (1 + Math.abs(comp) / 100)).toFixed(4);
  } else if (comp == 0) {
    return avg.toFixed(4);
  } else if (comp > 0) {
    if (avg >= 0) return (avg * (1 + Math.abs(comp) / 100)).toFixed(4);
    else if (avg < 0) return (avg / (1 + Math.abs(comp) / 100)).toFixed(4);
  }
}

export function compileCalculations(side, ballot) {
  const calculations = {};

  ballot.scores.forEach((s) => {
    if (s.score_type.startsWith(side)) {
      let calc;

      if (
        s.score_type === "p1" ||
        s.score_type === "d1" ||
        s.score_type === "p14" ||
        s.score_type === "d14"
      ) {
        calc = speechCalculation(s.score_type, ballot);
      } else if (
        s.score_type === "p4" ||
        s.score_type === "p7" ||
        s.score_type === "p10" ||
        s.score_type === "p11" ||
        s.score_type === "p12" ||
        s.score_type === "p13" ||
        s.score_type === "d2" ||
        s.score_type === "d3" ||
        s.score_type === "d4" ||
        s.score_type === "d7" ||
        s.score_type === "d10" ||
        s.score_type === "d13"
      ) {
        calc = crossCalculation(s.score_type, ballot);
      } else {
        calc = directCalculation(s.score_type, ballot);
      }

      calculations[s.score_type] = {
        ...calc,
        merged: mergeCalculations({
          avg: calc[Object.keys(calc)[0]],
          comp: calc[Object.keys(calc)[1]],
        }),
      };
    }
  });

  return calculations;
}
