// Dependency imports
import { Link } from "react-router-dom";

// Component imports
import List from "../../../../common/components/List";

export default function CaseList({ cases }) {
  const mappedCases = [];
  cases.map((c) =>
    mappedCases.push(
      <Link key={c.id} to={`/cases?caseId=${c.id}`}>
        {c.name}
      </Link>
    )
  );
  if (mappedCases.length == 0) mappedCases.push("None");
  return <List items={mappedCases} />;
}
