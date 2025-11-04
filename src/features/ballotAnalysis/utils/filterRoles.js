function roundAttorneys({ role_rounds, side }) {
  const attorneys = role_rounds.filter((rr) => {
    if (side === "p") {
      return ["p2", "p5", "p8"].includes(rr.role_type);
    } else if (side === "d") {
      return ["d5", "d8", "d11"].includes(rr.role_type);
    }
    return false;
  });

  return attorneys;
}

function roundWitnesses({ role_rounds, side }) {
  const witnesses = role_rounds.filter((rr) => {
    if (side === "p") {
      return ["p3", "p6", "p9"].includes(rr.role_type);
    } else if (side === "d") {
      return ["d6", "d9", "d12"].includes(rr.role_type);
    }
    return false;
  });

  return witnesses;
}

export function roundStudents({ role_rounds, side }) {
  const attorneys = roundAttorneys({ role_rounds, side });
  const witnesses = roundWitnesses({ role_rounds, side });

  const students = {
    attorneys: attorneys.sort((a, b) =>
      a.student.name.localeCompare(b.student.name)
    ),
    witnesses: witnesses.sort((a, b) =>
      a.student.name.localeCompare(b.student.name)
    ),
  };

  return students;
}

export function findOpeningAttorney({ role_rounds, side }) {
  return role_rounds?.find((rr) => rr.role_type === `${side}1`);
}

export function findClosingAttorney({ role_rounds, side }) {
  return role_rounds?.find((rr) => rr.role_type === `${side}14`);
}

export function findMiddleAttorney({ role_rounds, side }) {
  const attorneys = roundAttorneys({ role_rounds, side });

  const openerId = findOpeningAttorney({ role_rounds, side })?.student.id;
  const closerId = findClosingAttorney({ role_rounds, side })?.student.id;

  const middleAttorney = attorneys.filter((att) => {
    return att.student.id !== openerId && att.student.id !== closerId;
  });

  return middleAttorney[0];
}

function findAttorneyDirects({ role_rounds, side }) {
  const attorneys = role_rounds.filter((rr) => {
    if (side === "p") {
      return ["p2", "p5", "p8"].includes(rr.role_type);
    } else if (side === "d") {
      return ["d5", "d8", "d11"].includes(rr.role_type);
    }
    return false;
  });

  return attorneys;
}

function findAttorneyCrosses({ role_rounds, side }) {
  const attorneys = role_rounds.filter((rr) => {
    if (side === "p") {
      return ["p11", "p12", "p13"].includes(rr.role_type);
    } else if (side === "d") {
      return ["d2", "d3", "d4"].includes(rr.role_type);
    }
    return false;
  });

  return attorneys;
}

export function findAttorneyDirectsWitnesses({
  role_rounds,
  side,
  witness_rounds,
}) {
  const attorneys = findAttorneyDirects({ role_rounds, side });

  const attorneyDirectsWitnesses = attorneys.map((att) => {
    return {
      ...att,
      witness: witness_rounds?.find((wr) => {
        if (att.role_type === "p2") return wr.role_type === "p1";
        if (att.role_type === "p5") return wr.role_type === "p2";
        if (att.role_type === "p8") return wr.role_type === "p3";
        if (att.role_type === "d5") return wr.role_type === "d1";
        if (att.role_type === "d8") return wr.role_type === "d2";
        if (att.role_type === "d11") return wr.role_type === "d3";
      }),
      witness_student: role_rounds?.find((wr) => {
        if (att.role_type === "p2") return wr.role_type === "p3";
        if (att.role_type === "p5") return wr.role_type === "p6";
        if (att.role_type === "p8") return wr.role_type === "p9";
        if (att.role_type === "d5") return wr.role_type === "d6";
        if (att.role_type === "d8") return wr.role_type === "d9";
        if (att.role_type === "d11") return wr.role_type === "d12";
      })?.student,
    };
  });

  return attorneyDirectsWitnesses;
}

export function findAttorneyCrossesWitnesses({
  role_rounds,
  side,
  witness_rounds,
}) {
  const attorneys = findAttorneyCrosses({ role_rounds, side });

  const attorneyCrossesWitnesses = attorneys.map((att) => {
    return {
      ...att,
      witness: witness_rounds?.find((wr) => {
        if (att.role_type === "p11") return wr.role_type === "d1";
        if (att.role_type === "p12") return wr.role_type === "d2";
        if (att.role_type === "p13") return wr.role_type === "d3";
        if (att.role_type === "d2") return wr.role_type === "p1";
        if (att.role_type === "d3") return wr.role_type === "p2";
        if (att.role_type === "d4") return wr.role_type === "p3";
      }),
    };
  });

  return attorneyCrossesWitnesses;
}

export function attorneyDirectsHelpers({
  attorneyDirectsWitnesses,
  attorneyId,
}) {
  const selected = attorneyDirectsWitnesses?.find(
    (adw) => adw.student.id === attorneyId
  );

  const witnessStudentName = selected?.witness_student?.name;
  const witnessName = selected?.witness?.witness?.name;
  const directOrder = selected?.witness?.role_type?.slice(-1);

  return { witnessStudentName, witnessName, directOrder };
}

export function attorneyCrossesHelpers({
  attorneyCrossesWitnesses,
  attorneyId,
}) {
  const selected = attorneyCrossesWitnesses?.find(
    (acw) => acw.student.id === attorneyId
  );

  const witnessName = selected?.witness?.witness?.name;
  const crossOrder = selected?.witness?.role_type?.slice(-1);

  return { witnessName, crossOrder };
}

export function attorneyWitnessHelper({
  attorneyDirectsWitnesses,
  attorneyCrossesWitnesses,
  attorneyId,
}) {
  const selectedDirect = attorneyDirectsWitnesses?.find(
    (adw) => adw.student.id === attorneyId
  );
  const selectedCross = attorneyCrossesWitnesses?.find(
    (acw) => acw.student.id === attorneyId
  );

  const directWitness = selectedDirect?.witness?.witness;
  const crossWitness = selectedCross?.witness?.witness;

  return { directWitness, crossWitness };
}

export function witnessWitnessHelper({
  role_rounds,
  witness_rounds,
  witnessId,
}) {
  const selectedWitness = role_rounds
    .sort(
      (a, b) => Number(a.role_type.slice(-1)) - Number(b.role_type.slice(-1))
    )
    .filter((rr) => rr.student.id === witnessId);

  switch (selectedWitness[0]?.role_type) {
    case "p3":
    case "p4":
      return witness_rounds?.find((wr) => wr.role_type === "p1")?.witness;
    case "p6":
    case "p7":
      return witness_rounds?.find((wr) => wr.role_type === "p2")?.witness;
    case "p9":
    case "p10":
      return witness_rounds?.find((wr) => wr.role_type === "p3")?.witness;
    case "d6":
    case "d7":
      return witness_rounds?.find((wr) => wr.role_type === "d1")?.witness;
    case "d9":
    case "d10":
      return witness_rounds?.find((wr) => wr.role_type === "d2")?.witness;
    case "d12":
    case "d13":
      return witness_rounds?.find((wr) => wr.role_type === "d3")?.witness;
    default:
      return null;
  }
}
