// Dependency imports
import { Link } from "react-router-dom";
import { Group } from "@mantine/core";

// Component imports
import CardList from "../../../../../common/components/CardList";
import List from "../../../../../common/components/List";
import Loading from "../../../../../common/components/Loading";

// Hooks imports
import { useCases } from "../../../../../hooks/api/useCases";

export default function TournamentList({ tournaments }) {
  const { data: allCases = [], isPending: isCasesPending } = useCases();

  if (isCasesPending) return <Loading />;

  const mappedTournaments = [];

  tournaments.map((t) => {
    const linkedCaseName = allCases.find(c => c.id === t.case_id).name;
    const textList=[`Case: ${linkedCaseName}`];

    let color;
    switch (t.area.toLowerCase()) {
      case "invitational": color = "errorRed"; break;
      case "regionals": color = "emerald"; break;
      case "orcs": color = "sunshine"; break;
      case "nationals": color = "lavender"; break;
      case "rookie rumble": color = "coral"; break;
      case "olt": color = "mint"; break;
      case "other": color = "peach"; break;
      default: color = "lightGray"; break;
    }

    mappedTournaments.push(
      {
        title: <Link to={`/schools?schoolId=${t.school_id}&tournamentId=${t.id}`}>{t.name} ({t.year})</Link>,
        badges: [
          {
            text: t.type,
            color: t.type === "Post-Stack" ? "darkBlue" : "primaryBlue"
          },
          {
            text: t.area,
            color: color
          }
        ],
        text: <Group maw="100%"><List withPadding={false} items={textList} listStyleType="none" /></Group>
      }
    )
  })
  return <CardList items={mappedTournaments} />;
}
