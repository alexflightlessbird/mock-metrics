// Dependency imports
import { Link } from "react-router-dom";

// Component imports
import List from "../../../../../common/components/List";

export default function StudentList({ students }) {
  const mappedStudents = [];
  students.map((s) =>
    mappedStudents.push(
      <Link to={`/schools?schoolId=${s.school_id}&studentId=${s.id}`}>
        {s.name}
      </Link>
    )
  );
  if (mappedStudents.length == 0) mappedStudents.push("None");
  return <List items={mappedStudents} />;
}
