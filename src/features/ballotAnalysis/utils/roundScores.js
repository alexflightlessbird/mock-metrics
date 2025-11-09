import {
  findAttorneyDirectsWitnesses,
  findAttorneyCrossesWitnesses,
  roundStudents,
  attorneyWitnessHelper,
  witnessWitnessHelper,
} from "./filterRoles";

export default function roundScores({
  role_rounds,
  calculations,
  side,
  witness_rounds,
}) {
  const students = roundStudents({ role_rounds, side });

  const attorneyDirectsWitnesses = findAttorneyDirectsWitnesses({
    role_rounds,
    side,
    witness_rounds,
  });
  const attorneyCrossesWitnesses = findAttorneyCrossesWitnesses({
    role_rounds,
    side,
    witness_rounds,
  });

  const attorneyCalculations = students.attorneys.map((att) => {
    const calcs = calculations.filter((c) => c.student.id === att.student.id);

    let direct;
    let cross;
    let speech;

    const directWitness = attorneyWitnessHelper({
      attorneyDirectsWitnesses,
      attorneyCrossesWitnesses,
      attorneyId: att.student.id,
    }).directWitness;
    const crossWitness = attorneyWitnessHelper({
      attorneyDirectsWitnesses,
      attorneyCrossesWitnesses,
      attorneyId: att.student.id,
    }).crossWitness;

    //prettier-ignore
    if (side === "p") {
        direct = calcs.find((c) => c.score_type === "p2" || c.score_type === "p5" || c.score_type === "p8");
        cross = calcs.find((c) => c.score_type === "p11" || c.score_type === "p12" || c.score_type === "p13");
        speech = calcs.find((c) => c.score_type === "p1" || c.score_type === "p14") || null;

    } else if (side === "d") {
        direct = calcs.find((c) => c.score_type === "d5" || c.score_type === "d8" || c.score_type === "d11");
        cross = calcs.find((c) => c.score_type === "d2" || c.score_type === "d3" || c.score_type === "d4");
        speech = calcs.find((c) => c.score_type === "d1" || c.score_type === "d14") || null;
    }

    return {
      student: att.student,
      side,
      calculations: {
        direct: {
          score: direct ? parseFloat(direct.merged) : null,
          witness: directWitness,
        },
        cross: {
          score: cross ? parseFloat(cross.merged) : null,
          witness: crossWitness,
        },
        speech: {
          score: speech ? parseFloat(speech.merged) : null,
          type: speech
            ? speech.score_type.slice(1) === "1"
              ? "open"
              : speech.score_type.slice(1) === "14"
              ? "close"
              : null
            : null,
        },
      },
    };
  });

  const witnessCalculations = students.witnesses.map((wit) => {
    const calcs = calculations.filter((c) => c.student.id === wit.student.id);

    let direct;
    let cross;

    const witness = witnessWitnessHelper({
      role_rounds,
      witness_rounds,
      witnessId: wit.student.id,
    });

    //prettier-ignore
    if (side === "p") {
        direct = calcs.find((c) => c.score_type === "p3" || c.score_type === "p6" || c.score_type === "p9");
        cross = calcs.find((c) => c.score_type === "p4" || c.score_type === "p7" || c.score_type === "p10");
    } else if (side === "d") {
        direct = calcs.find((c) => c.score_type === "d6" || c.score_type === "d9" || c.score_type === "d12");
        cross = calcs.find((c) => c.score_type === "d7" || c.score_type === "d10" || c.score_type === "d13"); 
    }

    return {
      student: wit.student,
      side,
      calculations: {
        witness,
        direct: {
          score: direct ? parseFloat(direct.merged) : null,
        },
        cross: {
          score: cross ? parseFloat(cross.merged) : null,
        },
      },
    };
  });

  return {
    attorneys: attorneyCalculations,
    witnesses: witnessCalculations,
  };
}
