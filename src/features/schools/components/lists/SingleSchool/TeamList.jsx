// Dependency imports
import { Link } from "react-router-dom";
import { Group } from "@mantine/core";

// Component imports
import CardList from "../../../../../common/components/CardList";
import List from "../../../../../common/components/List";
import Loading from "../../../../../common/components/Loading";

// Hooks imports
import { useCases } from "../../../../../hooks/api/useCases";

export default function TeamList({ teams }) {
  const { data: allCases = [], isPending: isCasesPending } = useCases();

  if (isCasesPending) return <Loading />;

  const mappedTeams = [];
  
  teams.map((t) => {
    const linkedCaseName = allCases.find(c => c.id === t.case_id).name;
    const textList = [`Case: ${linkedCaseName}`];

    mappedTeams.push(
      {
        title: <Link to={`/schools?schoolId=${t.school_id}&teamId=${t.id}`}>{t.name} ({t.year})</Link>,
        badges: [
          {
            text: t.type,
            color: t.type === "Post-Stack" ? "darkBlue" : "primaryBlue"
          }
        ],
        text: <Group maw="100%"><List withPadding={false} items={textList} listStyleType="none" /></Group>
      }
    )
  }
  );
  return <CardList items={mappedTeams} />;
}
