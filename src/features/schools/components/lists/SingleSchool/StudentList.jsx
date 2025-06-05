// Dependency imports
import { Link, useSearchParams } from "react-router-dom";
import { Group } from "@mantine/core";

// Component imports
import CardList from "../../../../../common/components/CardList";
import List from "../../../../../common/components/List";
import Loading from "../../../../../common/components/Loading";

// Hooks imports
import { useSchoolStudentTeams, useSchoolTeams } from "../../../../../hooks/api/useSchoolData";

export default function StudentList({ students }) {
  const [searchParams] = useSearchParams();

  const schoolId = searchParams.get("schoolId");

  const { data: allStudentTeams = [], isPending: isStudentTeamsPending } = useSchoolStudentTeams(schoolId);
  const { data: allTeams = [], isPending: isTeamsPending } = useSchoolTeams(schoolId);

  if (isStudentTeamsPending || isTeamsPending) return <Loading />;

  const studentTeamMap = {};
  allStudentTeams.forEach(st => {
    if (st.is_active) {
      const team = allTeams.find(t => t.id === st.team_id);
      if (team) studentTeamMap[st.student_id] = team.name;
    }
  });

  const mappedStudents = [];
  
  students.map((s) => {    
    const currentTeamName = studentTeamMap[s.id] || "None";
    const textList = [`Current Team: ${currentTeamName}`];
    
    mappedStudents.push(
      {
        title: <Link to={`/schools?schoolId=${s.school_id}&studentId=${s.id}`}>{s.name}</Link>,
        text: <Group maw="100%"><List withPadding={false} items={textList} listStyleType="none" /></Group>
        }
      )
    });
  return <CardList items={mappedStudents} />;
}
