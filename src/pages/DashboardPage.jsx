import {
  Container,
  Title,
  Space,
  Text,
  Flex,
  List,
  Skeleton,
} from "@mantine/core";
import { useAuth } from "../context/AuthContext";
import { useUserAssignments } from "../common/hooks/useUserAssignments";
import {
  useSchoolUsers,
  useSchoolTeams,
  useSchoolStudents,
} from "../common/hooks/useSchoolDetails";
import Loader from "../common/components/loader/GavelLoader";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";
import BasePage from "../common/components/BasePage";

export default function DashboardPage() {
  const { user } = useAuth();
  const { assignments, isLoading } = useUserAssignments(user.id);
  const [primaryAdmins, setPrimaryAdmins] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [viewers, setViewers] = useState([]);

  const [selectedSchoolId, setSelectedSchoolId] = useLocalStorage({
    key: "school",
    defaultValue: null,
  });

  const { data: teams = [], isLoading: teamsLoading = true } =
    useSchoolTeams(selectedSchoolId);
  const { data: students = [], isLoading: studentsLoading = true } =
    useSchoolStudents(selectedSchoolId);
  const { data: users = [], isLoading: usersLoading = true } =
    useSchoolUsers(selectedSchoolId);

  useEffect(() => {
    if (
      assignments?.length === 1 &&
      assignments[0]?.school_id !== selectedSchoolId
    )
      setSelectedSchoolId(assignments[0]?.school_id);
  }, [assignments]);

  useEffect(() => {
    if (usersLoading) return;
    const primaryAdmins = users.filter((u) => u.role === "primary");
    const admins = users.filter((u) => u.role === "admin");
    const viewers = users.filter((u) => u.role === "viewer");

    setPrimaryAdmins(primaryAdmins);
    setAdmins(admins);
    setViewers(viewers);
  }, [users, usersLoading]);

  if (isLoading)
    return (
      <Container>
        <Flex justify="center" mt="xs" align="center">
          <Loader scale={1.5} />
        </Flex>
      </Container>
    );

  return (
    <BasePage titleText="User Dashboard">
      {assignments.length === 0 && (
        <Text>
          You are not assigned to any schools. Please have your school's Primary
          Admin reach out to support to be added.
        </Text>
      )}
      {selectedSchoolId && (
        <>
          <Title order={2}>School Info</Title>

          <Space h="md" />
          <Title order={3}>Teams</Title>
          {teamsLoading ? (
            <List>
              {[1, 2, 3].map((i) => (
                <List.Item key={i}>
                  <Skeleton height={20} width={150} />
                </List.Item>
              ))}
            </List>
          ) : teams.length > 0 ? (
            <List>
              {teams.map((t) => (
                <List.Item key={t.id}>{t.name}</List.Item>
              ))}
            </List>
          ) : (
            <Text c="dimmed">No teams found</Text>
          )}

          <Space h="md" />
          <Title order={3}>Students</Title>
          {studentsLoading ? (
            <List>
              {[1, 2, 3].map((i) => (
                <List.Item key={i}>
                  <Skeleton height={20} width={150} />
                </List.Item>
              ))}
            </List>
          ) : students.length > 0 ? (
            <List>
              {students.map((s) => (
                <List.Item key={s.id}>{s.name}</List.Item>
              ))}
            </List>
          ) : (
            <Text c="dimmed">No students found</Text>
          )}
        </>
      )}
    </BasePage>
  );
}
