import { Link } from "react-router-dom";
import List from "../../../../../common/components/List";

export default function TournamentList({ tournaments }) {
  const mappedTournaments = [];
  tournaments.map((t) =>
    mappedTournaments.push(
      <Link to={`/schools?schoolId=${t.school_id}&tournamentId=${t.id}`}>
        {t.name} ({t.year})
      </Link>
    )
  );
  if (mappedTournaments.length == 0) mappedTournaments.push("None");
  return <List items={mappedTournaments} />;
}
