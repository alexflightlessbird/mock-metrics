import { Link } from "react-router-dom";
import List from "../../../../common/components/List";

export default function SchoolList({ schools }) {
  const mappedSchools = [];
  schools.map((s) =>
    mappedSchools.push(
      <Link to={`/schools?schoolId=${s.school_id}`}>{s.schools.name}</Link>
    )
  );
  if (mappedSchools.length == 0) mappedSchools.push("None");
  return <List items={mappedSchools} />;
}
