import { Container, Title, Button, Group, Space, Text, Select, Flex, List } from "@mantine/core";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useUserAssignments } from "../features/dashboard/hooks/useUserAssignments";
import { useSchoolDetails, useSchoolTeams, useSchoolStudents, useSchoolTournaments } from "../features/dashboard/hooks/useSchoolDetails";
import Loader from "../common/components/loader/GavelLoader";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect } from "react";

export default function DashboardPage() {
  const { signOut, isSuperAdmin, user } = useAuth();
  const navigate = useNavigate();
  const { assignments, isLoading } = useUserAssignments(user.id);

  const [selectedSchool, setSelectedSchool] = useLocalStorage({
    key: "school",
    defaultValue: null
  });

  const { data: teams = [] } = useSchoolTeams(selectedSchool);
  const { data: students = [] } = useSchoolStudents(selectedSchool);
  const { data: tournaments = [] } = useSchoolTournaments(selectedSchool);

  useEffect(() => {
    if (assignments?.length === 1) setSelectedSchool(assignments[0]?.school_id);
  }, [assignments, setSelectedSchool]);

  if (isLoading) return (
    <Container>
      <Flex justify="center" mt="xs" align="center">
        <Loader key={"dashboard-loader-animation"} scale={1.5} />
      </Flex>
    </Container>
  );

  const schoolOptions = assignments.map((a) => ({
    value: a.school_id,
    label: a.schools?.short_name || a.schools?.name || `Unknown School (ID: ${a.school_id})`
  }));

  return (
    <Container>
      <Title order={1}>User Dashboard</Title>
      <Space h="md" />
      <Group>
        <Button onClick={signOut}>Sign Out</Button>
        {isSuperAdmin && (
          <Button onClick={() => navigate("/admin")}>Admin Dashboard</Button>
        )}
      </Group>
      {assignments.length === 0 && (
        <>
          <Space h="xs" />
          <Text>You are not assigned to any schools. Please have your school's Primary Admin reach out to support to be added.</Text>
        </>
      )}
      {assignments.length > 1 && (
        <>
          <Space h="xs" />
          <Select
            data={schoolOptions}
            value={selectedSchool}
            onChange={setSelectedSchool}
            allowDeselect={false}
          />
        </>
      )}
      {selectedSchool && (
        <>
          <Space h="xs" />
          {teams.length > 0 && (
            <>
              <Text>Teams</Text>
              <List>
                {teams.map((t) => <List.Item key={t.id}>{t.id}</List.Item>)}
              </List>
              <Space h="xs" />
            </>
          )}
          {students.length > 0 && (
            <>
              <Text>Students</Text>
              <List>
                {students.map((s) => <List.Item key={s.id}>{s.id} - {s.name}</List.Item>)}
              </List>
              <Space h="xs" />
            </>
          )}
          {tournaments.length > 0 && (
            <>
              <Text>Tournaments</Text>
              <List>
                {tournaments.map((t) => <List.Item key={t.id}>{t.id}</List.Item>)}
              </List>
              <Space h="xs" />
            </>
          )}
        </>
      )}
    </Container>
  );
}
