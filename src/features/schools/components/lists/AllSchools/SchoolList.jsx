// Dependency imports
import { Link } from "react-router-dom";
import { useMantineTheme } from "@mantine/core";

// Component imports
import CardList from "../../../../../common/components/CardList";
import List from "../../../../../common/components/List";

// Utils imports
import { ROLES } from "../../../../../utils/constants";

export default function SchoolList({ schools }) {
  const theme = useMantineTheme();

  const mappedSchools = [];
  
  schools.map((s) =>
    mappedSchools.push(
      {
        title: <Link to={`/schools?schoolId=${s.school_id}`}>{s.schools.name}</Link>,
        badges: [
          {
            text: s.role,
            color: s.role === ROLES.ADMIN ? theme.colors.darkBlue[0] : s.role === ROLES.PRIMARY ? theme.colors.primaryBlue[0] : theme.colors.lightGray[0]
          }
        ]
      }
    )
  );
  return <CardList items={mappedSchools} />;
}
