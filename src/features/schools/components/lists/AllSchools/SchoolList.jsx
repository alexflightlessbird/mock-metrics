// Dependency imports
import { Link } from "react-router-dom";

// Component imports
import CardList from "../../../../../common/components/CardList";

// Utils imports
import { ROLES } from "../../../../../utils/constants";

export default function SchoolList({ schools }) {
  const mappedSchools = [];
  
  schools.map((s) =>
    mappedSchools.push(
      {
        title: <Link to={`/schools?schoolId=${s.school_id}`}>{s.schools.name}</Link>,
        badges: [
          {
            text: s.role,
            color: s.role === ROLES.ADMIN ? "darkBlue" : s.role === ROLES.PRIMARY ? "primaryBlue" : "lightGray"
          }
        ]
      }
    )
  );
  return <CardList items={mappedSchools} />;
}
