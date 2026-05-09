export function condenseStudentByTeam(studentsArr, type = "attorney") {
  const condensed = [];

  const studentIdsUsed = [];

  studentsArr.forEach((s) => {
    const studentId = s.student.id;
    const side = s.side;

    if (!studentIdsUsed.includes(`${studentId}.${side}`)) {
      studentIdsUsed.push(`${studentId}.${side}`);
    }
  });

  function getTeamDetails(studentEntry) {
    const teamName = studentEntry.teamName;
    const teamId = studentEntry.teamId;

    return { teamName, teamId };
  }

  studentIdsUsed.forEach((studentIdWithSide) => {
    // split into studentId and side
    const [studentId, side] = studentIdWithSide.split(".");

    // Find all entries for this student and side
    const entriesForStudent = studentsArr.filter(
      (s) => s.student.id === studentId && s.side === side,
    );

    // Get team details for each entry
    const teamDetails = entriesForStudent?.map((s) => getTeamDetails(s));

    // Remove duplicate team details (in case the same student is listed multiple times for the same team)
    // Only use the teamId to determine uniqueness, since teamName may have duplicates across different years
    const uniqueTeamDetails = [];
    const teamIdsSeen = new Set();

    // Iterate through teamDetails and add unique entries to uniqueTeamDetails
    teamDetails.forEach((td) => {
      if (!teamIdsSeen.has(td.teamId)) {
        teamIdsSeen.add(td.teamId);
        uniqueTeamDetails.push(td);
      }
    });

    // Sort teamDetails by teamName alphabetically
    uniqueTeamDetails.sort((a, b) => a.teamName.localeCompare(b.teamName));

    // Convert teamDetails teamName and teamId into individual strings
    const teamNames = uniqueTeamDetails.map((t) => t.teamName).join(", ");
    const teamIds = uniqueTeamDetails.map((t) => t.teamId).join(", ");

    // Get all scores for this student and side
    const scoresForStudent = entriesForStudent?.map((s) => s.scores)?.flat();

    // Calculate average score(s) for this student and side
    const averageDirect = parseFloat(
      (
        scoresForStudent?.reduce((sum, calc) => sum + calc.direct.score, 0) /
        scoresForStudent?.length
      ).toFixed(4),
    );
    const averageCross = parseFloat(
      (
        scoresForStudent?.reduce((sum, calc) => sum + calc.cross.score, 0) /
        scoresForStudent?.length
      ).toFixed(4),
    );
    const average = parseFloat(((averageDirect + averageCross) / 2).toFixed(2));

    if (type === "attorney") {
      const averageSpeech = scoresForStudent?.some(
        (calc) => calc.speech.score !== null,
      )
        ? parseFloat(
            (
              scoresForStudent?.reduce(
                (sum, calc) => sum + calc.speech.score,
                0,
              ) / scoresForStudent?.length
            ).toFixed(4),
          )
        : null;

      condensed.push({
        student: entriesForStudent[0].student,
        teamId: teamIds,
        teamName: teamNames,
        side,
        averageDirect,
        averageCross,
        average,
        averageSpeech,
        scores: scoresForStudent,
      });
    } else if (type === "witness") {
      condensed.push({
        student: entriesForStudent[0].student,
        teamId: teamIds,
        teamName: teamNames,
        side,
        averageDirect,
        averageCross,
        average,
        scores: scoresForStudent,
      });
    }
  });

  return condensed;
}

export function condenseStudentBySide(studentsArr, type = "attorney") {
  const condensed = [];

  const studentIdsUsed = [];

  studentsArr.forEach((s) => {
    const studentId = s.student.id;
    const teamId = s.teamId;

    if (!studentIdsUsed.includes(`${studentId}.${teamId}`)) {
      studentIdsUsed.push(`${studentId}.${teamId}`);
    }
  });

  studentIdsUsed.forEach((studentIdWithTeam) => {
    // Split into studentId and teamId
    const [studentId, teamId] = studentIdWithTeam.split(".");

    // Find all entries for this student and team
    const entriesForStudent = studentsArr.filter(
      (s) => s.student.id === studentId && s.teamId === teamId,
    );

    // Get side details for each entry
    const sideDetails = entriesForStudent
      ?.map((s) => s.side)
      .flat()
      .sort((a, b) => b.localeCompare(a));

    // Only keep unique side details
    const uniqueSideDetails = [...new Set(sideDetails)];

    // Convert side details into a string
    const sides = uniqueSideDetails.join(", ");

    // Get all scores for this student and team
    const scoresForStudent = entriesForStudent?.map((s) => s.scores)?.flat();

    // Calculate average score(s) for this student and team
    const averageDirect = parseFloat(
      (
        scoresForStudent?.reduce((sum, calc) => sum + calc.direct.score, 0) /
        scoresForStudent?.length
      ).toFixed(4),
    );
    const averageCross = parseFloat(
      (
        scoresForStudent?.reduce((sum, calc) => sum + calc.cross.score, 0) /
        scoresForStudent?.length
      ).toFixed(4),
    );
    const average = parseFloat(((averageDirect + averageCross) / 2).toFixed(2));

    if (type === "attorney") {
      const averageSpeech = scoresForStudent?.some(
        (calc) => calc.speech.score !== null,
      )
        ? parseFloat(
            (
              scoresForStudent?.reduce(
                (sum, calc) => sum + calc.speech.score,
                0,
              ) / scoresForStudent?.length
            ).toFixed(4),
          )
        : null;

      condensed.push({
        student: entriesForStudent[0].student,
        teamId,
        teamName: entriesForStudent[0].teamName,
        side: sides,
        averageDirect,
        averageCross,
        average,
        averageSpeech,
        scores: scoresForStudent,
      });
    } else if (type === "witness") {
      condensed.push({
        student: entriesForStudent[0].student,
        teamId,
        teamName: entriesForStudent[0].teamName,
        side: sides,
        averageDirect,
        averageCross,
        average,
        scores: scoresForStudent,
      });
    }
  });

  return condensed;
}

export function condenseStudentByTeamAndSide(studentsArr, type = "attorney") {
  const condensed = [];

  const studentIdsUsed = [];

  studentsArr.forEach((s) => {
    const studentId = s.student.id;

    if (!studentIdsUsed.includes(studentId)) {
      studentIdsUsed.push(studentId);
    }
  });

  function getTeamDetails(studentEntry) {
    const teamName = studentEntry.teamName;
    const teamId = studentEntry.teamId;

    return { teamName, teamId };
  }

  studentIdsUsed.forEach((studentId) => {
    // Find all entries for this student
    const entriesForStudent = studentsArr.filter(
      (s) => s.student.id === studentId,
    );

    // Get team details for each entry
    const teamDetails = entriesForStudent?.map((s) => getTeamDetails(s));

    // Remove duplicate team details (in case the same student is listed multiple times for the same team)
    // Only use the teamId to determine uniqueness, since teamName may have duplicates across different years
    const uniqueTeamDetails = [];
    const teamIdsSeen = new Set();

    // Iterate through teamDetails and add unique entries to uniqueTeamDetails
    teamDetails.forEach((td) => {
      if (!teamIdsSeen.has(td.teamId)) {
        teamIdsSeen.add(td.teamId);
        uniqueTeamDetails.push(td);
      }
    });

    // Sort teamDetails by teamName alphabetically
    uniqueTeamDetails.sort((a, b) => a.teamName.localeCompare(b.teamName));

    // Convert teamDetails teamName and teamId into individual strings
    const teamNames = uniqueTeamDetails.map((t) => t.teamName).join(", ");
    const teamIds = uniqueTeamDetails.map((t) => t.teamId).join(", ");

    // Get side details for each entry
    const sideDetails = entriesForStudent
      ?.map((s) => s.side)
      .flat()
      .sort((a, b) => b.localeCompare(a));

    // Only keep unique side details
    const uniqueSideDetails = [...new Set(sideDetails)];

    // Convert side details into a string
    const sides = uniqueSideDetails.join(", ");

    // Get all scores for this student
    const scoresForStudent = entriesForStudent?.map((s) => s.scores)?.flat();

    // Calculate average score(s) for this student
    const averageDirect = parseFloat(
      (
        scoresForStudent?.reduce((sum, calc) => sum + calc.direct.score, 0) /
        scoresForStudent?.length
      ).toFixed(4),
    );
    const averageCross = parseFloat(
      (
        scoresForStudent?.reduce((sum, calc) => sum + calc.cross.score, 0) /
        scoresForStudent?.length
      ).toFixed(4),
    );
    const average = parseFloat(((averageDirect + averageCross) / 2).toFixed(2));

    if (type === "attorney") {
      const averageSpeech = scoresForStudent?.some(
        (calc) => calc.speech.score !== null,
      )
        ? parseFloat(
            (
              scoresForStudent?.reduce(
                (sum, calc) => sum + calc.speech.score,
                0,
              ) / scoresForStudent?.length
            ).toFixed(4),
          )
        : null;

      condensed.push({
        student: entriesForStudent[0].student,
        teamId: teamIds,
        teamName: teamNames,
        side: sides,
        averageDirect,
        averageCross,
        average,
        averageSpeech,
        scores: scoresForStudent,
      });
    } else if (type === "witness") {
      condensed.push({
        student: entriesForStudent[0].student,
        teamId: teamIds,
        teamName: teamNames,
        side: sides,
        averageDirect,
        averageCross,
        average,
        scores: scoresForStudent,
      });
    }
  });

  return condensed;
}
