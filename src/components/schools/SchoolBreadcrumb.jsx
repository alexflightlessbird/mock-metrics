import React from "react";
import Breadcrumb from "../../common/components/Breadcrumb";
import { Pill, useMantineTheme } from "@mantine/core";
import { Link, useSearchParams } from "react-router-dom";

export default function SchoolBreadcrumb({
  selectedSchool,
  allStudents,
  allTeams,
  allTournaments,
}) {
  const theme = useMantineTheme();
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get("teamId");
  const studentId = searchParams.get("studentId");
  const tournamentId = searchParams.get("tournamentId");

  const inactiveProps = {
    size: "md",
    style: {
      backgroundColor: theme.colors.lightGray[0],
      color: theme.colors.darkBlue[0],
      border: "1px solid " + theme.colors.darkBlue[0],
    },
  };

  const activeProps = {
    size: "lg",
    style: {
      backgroundColor: theme.colors.primaryBlue[0],
      color: theme.colors.lightGray[0],
    },
  };

  const getBreadcrumbItems = () => {
    const items = [];

    items.push({
      title:
        selectedSchool || teamId || studentId || tournamentId ? (
          <Link to="/schools">
            <Pill {...inactiveProps}>Schools</Pill>
          </Link>
        ) : (
          <Pill {...activeProps}>Schools</Pill>
        ),
    });

    if (selectedSchool) {
      items.push({
        title:
          teamId || studentId || tournamentId ? (
            <Link to={`/schools?schoolId=${selectedSchool.schools.id}`}>
              <Pill {...inactiveProps}>{selectedSchool.schools.name}</Pill>
            </Link>
          ) : (
            <Pill {...activeProps}>{selectedSchool.schools.name}</Pill>
          ),
      });

      if (teamId) {
        const team = allTeams.find((t) => t.id === parseInt(teamId));
        if (team)
          items.push({
            title: <Pill {...activeProps}>Team: {team.name}</Pill>,
          });
      } else if (studentId) {
        const student = allStudents.find((s) => s.id === parseInt(studentId));
        if (student)
          items.push({
            title: <Pill {...activeProps}>Student: {student.name}</Pill>,
          });
      } else if (tournamentId) {
        const tournament = allTournaments.find(
          (t) => t.id === parseInt(tournamentId)
        );
        if (tournament)
          items.push({
            title: (
              <Pill {...activeProps}>
                Tournament: {tournament.name} - {tournament.year}
              </Pill>
            ),
          });
      }
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems().map((item, index) => (
    <React.Fragment key={index}>{item.title}</React.Fragment>
  ));

  return <Breadcrumb>{breadcrumbItems}</Breadcrumb>;
}
