import { Link } from "react-router-dom";
import List from "../../../../../common/components/List";

export default function TeamList({ teams }) {
  const mappedTeams = [];
  teams.map((t) =>
    mappedTeams.push(
      <Link to={`/schools?schoolId=${t.school_id}&teamId=${t.id}`}>
        {t.name}
      </Link>
    )
  );
  if (mappedTeams.length == 0) mappedTeams.push("None");
  return <List items={mappedTeams} />;
}
