import ballotAverageCalc from "./ballotAverage";

export function directCalculation(oneToCalculate, ballot) {
  const ballotAverage = ballotAverageCalc(ballot.scores).overallAverage;
  const oneScore = parseInt(
    ballot.scores.find((s) => s.score_type === oneToCalculate).score_value
  );

  const directAvg = (oneScore - ballotAverage).toFixed(2);

  let otherSideScore1;
  let otherSideScore2;
  let otherSideScore3;

  if (oneToCalculate.startsWith("p")) {
    if (
      oneToCalculate === "p2" ||
      oneToCalculate === "p5" ||
      oneToCalculate === "p8"
    ) {
      otherSideScore1 = ballot.scores.find((s) => s.score_type === "d5");
      otherSideScore2 = ballot.scores.find((s) => s.score_type === "d8");
      otherSideScore3 = ballot.scores.find((s) => s.score_type === "d11");
    } else if (
      oneToCalculate === "p3" ||
      oneToCalculate === "p6" ||
      oneToCalculate === "p9"
    ) {
      otherSideScore1 = ballot.scores.find((s) => s.score_type === "d6");
      otherSideScore2 = ballot.scores.find((s) => s.score_type === "d9");
      otherSideScore3 = ballot.scores.find((s) => s.score_type === "d12");
    }
  } else if (oneToCalculate.startsWith("d")) {
    if (
      oneToCalculate === "d5" ||
      oneToCalculate === "d8" ||
      oneToCalculate === "d11"
    ) {
      otherSideScore1 = ballot.scores.find((s) => s.score_type === "p2");
      otherSideScore2 = ballot.scores.find((s) => s.score_type === "p5");
      otherSideScore3 = ballot.scores.find((s) => s.score_type === "p8");
    } else if (
      oneToCalculate === "d6" ||
      oneToCalculate === "d9" ||
      oneToCalculate === "d12"
    ) {
      otherSideScore1 = ballot.scores.find((s) => s.score_type === "p3");
      otherSideScore2 = ballot.scores.find((s) => s.score_type === "p6");
      otherSideScore3 = ballot.scores.find((s) => s.score_type === "p9");
    }
  }

  const otherSideAvg =
    (parseInt(otherSideScore1.score_value) +
      parseInt(otherSideScore2.score_value) +
      parseInt(otherSideScore3.score_value)) /
    3;

  const directComp = oneScore - otherSideAvg.toFixed(2);

  return {
    avg: parseFloat(directAvg),
    comp: parseFloat(directComp),
  };
}

export function crossCalculation(oneToCalculate, ballot) {
  const ballotAverage = ballotAverageCalc(ballot.scores).overallAverage;
  const oneScore = parseInt(
    ballot.scores.find((s) => s.score_type === oneToCalculate).score_value
  );

  const crossAvg = (oneScore - ballotAverage).toFixed(2);

  let otherSideComp = 0;

  switch (oneToCalculate) {
    case "p4":
      otherSideComp = parseInt(
        ballot.scores.find((s) => s.score_type === "d2").score_value
      );
      break;
    case "p7":
      otherSideComp = parseInt(
        ballot.scores.find((s) => s.score_type === "d3").score_value
      );
      break;
    case "p10":
      otherSideComp = parseInt(
        ballot.scores.find((s) => s.score_type === "d4").score_value
      );
      break;
    case "p11":
      otherSideComp = parseInt(
        ballot.scores.find((s) => s.score_type === "d7").score_value
      );
      break;
    case "p12":
      otherSideComp = parseInt(
        ballot.scores.find((s) => s.score_type === "d10").score_value
      );
      break;
    case "p13":
      otherSideComp = parseInt(
        ballot.scores.find((s) => s.score_type === "d13").score_value
      );
      break;
    case "d2":
      otherSideComp = parseInt(
        ballot.scores.find((s) => s.score_type === "p4").score_value
      );
      break;
    case "d3":
      otherSideComp = parseInt(
        ballot.scores.find((s) => s.score_type === "p7").score_value
      );
      break;
    case "d4":
      otherSideComp = parseInt(
        ballot.scores.find((s) => s.score_type === "p10").score_value
      );
      break;
    case "d7":
      otherSideComp = parseInt(
        ballot.scores.find((s) => s.score_type === "p11").score_value
      );
      break;
    case "d10":
      otherSideComp = parseInt(
        ballot.scores.find((s) => s.score_type === "p12").score_value
      );
      break;
    case "d13":
      otherSideComp = parseInt(
        ballot.scores.find((s) => s.score_type === "p13").score_value
      );
      break;
    default:
      otherSideComp = 0;
  }

  const crossComp = oneScore - otherSideComp;

  return {
    avg: parseFloat(crossAvg),
    comp: parseFloat(crossComp),
  };
}

export function speechCalculation(oneToCalculate, ballot) {
  const ballotAverage = ballotAverageCalc(ballot.scores).overallAverage;
  const oneScore = parseInt(
    ballot.scores.find((s) => s.score_type === oneToCalculate).score_value
  );

  const speechAvg = (oneScore - ballotAverage).toFixed(2);

  let otherSideComp = 0;

  switch (oneToCalculate) {
    case "p1":
      otherSideComp = parseInt(
        ballot.scores.find((s) => s.score_type === "d1").score_value
      );
      break;
    case "p14":
      otherSideComp = parseInt(
        ballot.scores.find((s) => s.score_type === "d14").score_value
      );
      break;
    case "d1":
      otherSideComp = parseInt(
        ballot.scores.find((s) => s.score_type === "p1").score_value
      );
      break;
    case "d14":
      otherSideComp = parseInt(
        ballot.scores.find((s) => s.score_type === "p14").score_value
      );
      break;
    default:
      otherSideComp = 0;
  }

  const speechComp = oneScore - otherSideComp;

  return {
    avg: parseFloat(speechAvg),
    comp: parseFloat(speechComp),
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
  const calculations = [];

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

      calculations.push({
        score_type: s.score_type,
        weight: s.weight != null ? parseFloat(s.weight) : 1,
        ...calc,
      });
    }
  });

  return calculations;
}

export function combineBallotsCalculations({ side, ballots, role_rounds }) {
  const combinedCalculations = [];

  ballots.forEach((ballot) => {
    const ballotCalculations = compileCalculations(side, ballot);

    ballotCalculations.forEach((bc) => {
      const existing = combinedCalculations?.find(
        (cc) => cc.score_type === bc.score_type
      );
      if (existing) {
        existing.avgs.push({ value: parseFloat(bc.avg), weight: bc.weight });
        existing.comps.push({ value: parseFloat(bc.comp), weight: bc.weight });
      } else {
        combinedCalculations.push({
          score_type: bc.score_type,
          avgs: [{ value: parseFloat(bc.avg), weight: bc.weight }],
          comps: [{ value: parseFloat(bc.comp), weight: bc.weight }],
        });
      }
    });
  });

  combinedCalculations.forEach((cc) => {
    const avgWeightSum = cc.avgs.reduce((sum, a) => sum + a.weight, 0);
    const compWeightSum = cc.comps.reduce((sum, c) => sum + c.weight, 0);

    const avgAvg = avgWeightSum === 0
      ? 0
      : cc.avgs.reduce((sum, a) => sum + a.value * a.weight, 0) / avgWeightSum;
    const compAvg = compWeightSum === 0
      ? 0
      : cc.comps.reduce((sum, c) => sum + c.value * c.weight, 0) / compWeightSum;

    cc.avg = avgAvg.toFixed(2);
    cc.comp = compAvg.toFixed(2);

    cc.merged = mergeCalculations({ avg: cc.avg, comp: cc.comp });

    const student = role_rounds.find(
      (rr) => rr.role_type === cc.score_type
    )?.students;

    cc.student = {
      id: student?.id,
      name: student?.name,
    };

    delete cc.avgs;
    delete cc.comps;
  });

  return combinedCalculations;
}

export function fullTournamentCalculations({ tournament }) {
  const tournamentTeams = tournament?.teamScores;

  const allAttorneyCalculations = [];
  const allWitnessCalculations = [];

  tournamentTeams?.forEach((team) => {
    const attorneys = team.scores.dAttorneyScores.concat(
      team.scores.pAttorneyScores
    );
    const witnesses = team.scores.dWitnessScores.concat(
      team.scores.pWitnessScores
    );

    attorneys.forEach((attorney) => {
      attorney.teamName = team.teamName;
      attorney.teamId = team.teamId;
    });
    witnesses.forEach((witness) => {
      witness.teamName = team.teamName;
      witness.teamId = team.teamId;
    });

    allAttorneyCalculations.push(...attorneys);
    allWitnessCalculations.push(...witnesses);
  });

  return {
    attorneys: allAttorneyCalculations,
    witnesses: allWitnessCalculations,
  };
}
