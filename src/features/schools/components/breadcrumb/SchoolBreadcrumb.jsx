// Dependency imoprts
import { Link, useSearchParams } from "react-router-dom";
import { Fragment } from "react";

// Component imports
import Breadcrumb from "../../../../common/components/Breadcrumb";
import BreadcrumbPill from "../../../../common/components/BreadcrumbPill";

// Hooks imports
import { useSchools } from "../../../../hooks/api/useSchools";
import {
  useSchoolTeams,
  useSchoolStudents,
  useSchoolTournaments,
  useSchoolRounds,
} from "../../../../hooks/api/useSchoolData";
import { useSelectedItem } from "../../../../common/hooks/useSelectedItem";
import { useSession } from "../../../../common/hooks/auth/useSession";

export default function SchoolBreadcrumb() {
  const [searchParams] = useSearchParams();
  const schoolId = searchParams.get("schoolId");
  const teamId = searchParams.get("teamId");
  const studentId = searchParams.get("studentId");
  const tournamentId = searchParams.get("tournamentId");
  const roundId = searchParams.get("roundId");

  const { userId } = useSession();

  const { data: allSchools = [], isPending: isSchoolsPending } =
    useSchools(userId);
  const { data: allSchoolTeams = [], isPending: isTeamsPending } =
    useSchoolTeams(schoolId);
  const { data: allSchoolStudents = [], isPending: isStudentsPending } =
    useSchoolStudents(schoolId);
  const { data: allSchoolTournaments = [], isPending: isTournamentsPending } =
    useSchoolTournaments(schoolId);
  const { data: allSchoolRounds = [], isPending: isRoundsPending } =
    useSchoolRounds(schoolId);

  const selectedSchool = useSelectedItem({
    items: allSchools,
    itemIdName: "school_id",
    id: schoolId,
  });
  const selectedTeam = useSelectedItem({
    items: allSchoolTeams,
    id: teamId,
  });
  const selectedStudent = useSelectedItem({
    items: allSchoolStudents,
    id: studentId,
  });
  const selectedTournament = useSelectedItem({
    items: allSchoolTournaments,
    id: tournamentId,
  });
  const selectedRound = useSelectedItem({
    items: allSchoolRounds,
    id: roundId,
  });

  if (
    isSchoolsPending ||
    (isTeamsPending && schoolId) ||
    (isStudentsPending && schoolId) ||
    (isTournamentsPending && schoolId) ||
    (isRoundsPending && schoolId)
  ) {
    return;
  }

  function getBreadcrumbItems() {
    if (!schoolId)
      return [{ title: <BreadcrumbPill active>Schools</BreadcrumbPill> }];

    const items = [
      {
        title: (
          <Link to="/schools">
            <BreadcrumbPill active={false}>Schools</BreadcrumbPill>
          </Link>
        ),
      },
    ];

    if (!selectedSchool) {
      items.push({ title: <BreadcrumbPill active>Not Found</BreadcrumbPill> });
      return items;
    }

    if (!teamId && !studentId && !tournamentId && !roundId) {
      items.push({
        title: (
          <BreadcrumbPill active>
            School: {selectedSchool.schools.name}
          </BreadcrumbPill>
        ),
      });
      return items;
    }

    items.push({
      title: (
        <Link to={`/schools?schoolId=${schoolId}`}>
          <BreadcrumbPill active={false}>
            {selectedSchool.schools.name}
          </BreadcrumbPill>
        </Link>
      ),
    });

    if (
      !selectedTeam &&
      !selectedStudent &&
      !selectedTournament &&
      !selectedRound
    ) {
      items.push({ title: <BreadcrumbPill active>Not Found</BreadcrumbPill> });
      return items;
    }

    if (selectedTeam) {
      items.push({
        title: (
          <BreadcrumbPill active>Team: {selectedTeam.name}</BreadcrumbPill>
        ),
      });
    } else if (selectedStudent) {
      items.push({
        title: (
          <BreadcrumbPill active>
            Student: {selectedStudent.name}
          </BreadcrumbPill>
        ),
      });
    } else if (selectedTournament) {
      items.push({
        title: (
          <BreadcrumbPill active>
            Tournament: {selectedTournament.name}
          </BreadcrumbPill>
        ),
      });
    } else if (selectedRound) {
      items.push({
        title: (
          <Link
            to={`/schools?schoolId=${schoolId}&tournamentId=${selectedRound.tournament_id}`}
          >
            <BreadcrumbPill>{selectedRound.tournaments.name}</BreadcrumbPill>
          </Link>
        ),
      });
      items.push({
        title: (
          <BreadcrumbPill active>
            Round: {selectedRound.round_number} (Team:{" "}
            {selectedRound.teams.name})
          </BreadcrumbPill>
        ),
      });
    }
    return items;
  }

  const breadcrumbItems = getBreadcrumbItems().map((item, index) => (
    <Fragment key={index}>{item.title}</Fragment>
  ));

  return <Breadcrumb>{breadcrumbItems}</Breadcrumb>;
}
