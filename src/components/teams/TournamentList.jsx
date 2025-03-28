import { Link } from "react-router-dom";
import List from "../../common/components/List";

export default function TournamentList({ tournaments }) {
  const mappedTournaments = [];
  tournaments.map((t) =>
    mappedTournaments.push(
      <Link to={`/tournaments?id=${t.tournaments.id}`}>
        {t.tournaments.name} ({t.tournaments.year})
      </Link>
    )
  );
  if (mappedTournaments.length == 0) mappedTournaments.push("None");
  return <List items={mappedTournaments} />;
}
