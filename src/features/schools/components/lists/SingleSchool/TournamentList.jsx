// Dependency imports
import { Link } from "react-router-dom";
import { Group, useMantineTheme } from "@mantine/core";

// Component imports
import CardList from "../../../../../common/components/CardList";
import List from "../../../../../common/components/List";
import Loading from "../../../../../common/components/Loading";

// Hooks imports
import { useCases } from "../../../../../hooks/api/useCases";

export default function TournamentList({ tournaments }) {
  const theme = useMantineTheme();

  const { data: allCases = [], isPending: isCasesPending } = useCases();

  if (isCasesPending) return <Loading />;

  const mappedTournaments = [];

  tournaments.map((t) => {
    const linkedCaseName = allCases.find(c => c.id === t.case_id).name;
    const textList=[`Case: ${linkedCaseName}`];

    let color;
    switch (t.area.toLowerCase()) {
      case "invitational": color = theme.colors.primaryBlue[0]; break;
      case "regionals": color = "red"; break;
      case "orcs": color = "orange"; break;
      case "nationals": color = "yellow"; break;
      case "rookie rumble": color = "green"; break;
      case "olt": color = "purple"; break;
      case "other": color = theme.colors.lightGray[0]; break;
      default: color = theme.colors.darkBlue[0]; break;
    }

    mappedTournaments.push(
      {
        title: <Link to={`/schools?schoolId=${t.school_id}&tournamentId=${t.id}`}>{t.name} ({t.year})</Link>,
        badges: [
          {
            text: t.area,
            color: color
          },
          {
            text: t.type,
            color: t.type === "Post-Stack" ? theme.colors.darkBlue[0] : theme.colors.primaryBlue[0]
          }
        ],
        text: <Group maw="100%"><List withPadding={false} items={textList} listStyleType="none" /></Group>
      }
    )
  })
  return <CardList items={mappedTournaments} />;
}
