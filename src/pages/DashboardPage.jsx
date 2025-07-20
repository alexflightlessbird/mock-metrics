import {
  Container,
  Title,
  Group,
  Space,
  Text,
  Select,
  Flex,
  List,
  Skeleton,
  ActionIcon,
} from "@mantine/core";
import { useAuth } from "../context/AuthContext";
import { useUserAssignments } from "../features/dashboard/hooks/useUserAssignments";
import {
  useSchoolDetails,
  useSchoolUsers,
  useSchoolTeams,
  useSchoolStudents,
  useSchoolTournaments,
} from "../features/dashboard/hooks/useSchoolDetails";
import Loader from "../common/components/loader/GavelLoader";
import { useLocalStorage, useClipboard } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { capitalize } from "../common/utils/helpers";
import { LuCopy as CopyIcon, LuCopyCheck as CopiedIcon } from "react-icons/lu";

export default function DashboardPage() {
  const { user } = useAuth();
  const { assignments, isLoading } = useUserAssignments(user.id);
  const [showSchoolId, setShowSchoolId] = useState(false);
  const clipboard = useClipboard({ timeout: 1000 });
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
  const { data: tournaments = [], isLoading: tournamentsLoading = true } =
    useSchoolTournaments(selectedSchoolId);
  const { data: users = [], isLoading: usersLoading = true } =
    useSchoolUsers(selectedSchoolId);
  const { data: schoolInformation = {}, isLoading: schoolLoading = true } =
    useSchoolDetails(selectedSchoolId);

  useEffect(() => {
    if (
      assignments?.length === 1 &&
      assignments[0]?.school_id !== selectedSchoolId
    )
      setSelectedSchoolId(assignments[0]?.school_id);
  }, [assignments]);

  const role = users.find((u) => u.user_id === user.id)?.role || "viewer";

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
          <Loader key={"dashboard-loader-animation"} scale={1.5} />
        </Flex>
      </Container>
    );

  const schoolOptions = assignments.map((a) => ({
    value: a.school_id,
    label: `${a.schools.name} (${a.schools?.short_name || ""})`,
  }));

  return (
    <Container fluid>
      <Title order={1}>User Dashboard</Title>
      {assignments.length === 0 && (
        <>
          <Space h="xs" />
          <Text>
            You are not assigned to any schools. Please have your school's
            Primary Admin reach out to support to be added.
          </Text>
        </>
      )}
      {assignments.length > 1 && (
        <>
          <Space h="md" />
          <Select
            data={schoolOptions}
            value={selectedSchoolId}
            onChange={setSelectedSchoolId}
            allowDeselect={false}
          />
        </>
      )}
      {selectedSchoolId && (
        <>
          <Space h="md" />
          <Title order={2}>School Information</Title>
          <List>
            {schoolLoading ? (
              <>
                <List.Item>
                  <Skeleton height={20} width={200} />
                </List.Item>
                <List.Item>
                  <Skeleton height={20} width={200} />
                </List.Item>
                <List.Item>
                  <Skeleton height={20} width={200} />
                </List.Item>
                <List.Item>
                  <Skeleton height={20} width={200} />
                </List.Item>
                <List.Item>
                  <Skeleton height={20} width={200} />
                </List.Item>
              </>
            ) : (
              <>
                <List.Item>Name: {schoolInformation.name}</List.Item>
                <List.Item>
                  Short Name: {schoolInformation.short_name}
                </List.Item>
                <List.Item>
                  Premium Status:{" "}
                  {schoolInformation.is_premium ? "Active" : "Inactive"}
                </List.Item>
                <List.Item>
                  Your Role:{" "}
                  {role === "primary" ? "Primary Admin" : capitalize(role)}
                </List.Item>
                <List.Item>
                  <Text
                    span
                    style={{ cursor: "pointer" }}
                    c="blue"
                    onClick={() => setShowSchoolId(!showSchoolId)}
                  >
                    {showSchoolId
                      ? "Hide School ID"
                      : "Show School ID (Support Purposes)"}
                  </Text>
                  {showSchoolId && (
                    <Group gap="xs">
                      <Text>{selectedSchoolId}</Text>
                      <ActionIcon
                        variant="subtle"
                        color={clipboard.copied ? "cyan" : "blue"}
                        onClick={() => clipboard.copy(selectedSchoolId)}
                      >
                        {clipboard.copied ? <CopiedIcon /> : <CopyIcon />}
                      </ActionIcon>
                    </Group>
                  )}
                </List.Item>
              </>
            )}
          </List>

          <Space h="md" />
          <Title order={4}>Users</Title>
          {usersLoading ? (
            <List>
              {[1, 2, 3].map((i) => (
                <List.Item key={i}>
                  <Skeleton height={20} width={150} />
                </List.Item>
              ))}
            </List>
          ) : users.length > 0 ? (
            <>
              <Title order={5}>Primary Admins</Title>
              {primaryAdmins.length > 0 ? (
                <>
                  <List>
                    {primaryAdmins.map((u) => (
                      <List.Item key={u.user_id}>
                        {u.users.name} ({u.users.email})
                      </List.Item>
                    ))}
                  </List>
                </>
              ) : (
                <Text c="dimmed">No users found</Text>
              )}
              <Title order={5}>Admins</Title>
              {admins.length > 0 ? (
                <>
                  <List>
                    {admins.map((u) => (
                      <List.Item key={u.user_id}>
                        {u.users.name} ({u.users.email})
                      </List.Item>
                    ))}
                  </List>
                </>
              ) : (
                <Text c="dimmed">No users found</Text>
              )}
              <Title order={5}>Viewers</Title>
              {viewers.length > 0 ? (
                <>
                  <List>
                    {viewers.map((u) => (
                      <List.Item key={u.user_id}>
                        {u.users.name} ({u.users.email})
                      </List.Item>
                    ))}
                  </List>
                </>
              ) : (
                <Text c="dimmed">No users found</Text>
              )}
            </>
          ) : (
            <Text c="dimmed">No users found</Text>
          )}

          <Space h="md" />
          <Title order={4}>Teams</Title>
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
          <Title order={4}>Students</Title>
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

          <Space h="md" />
          <Title order={4}>Tournaments</Title>
          {tournamentsLoading ? (
            <List>
              {[1, 2, 3].map((i) => (
                <List.Item key={i}>
                  <Skeleton height={20} width={150} />
                </List.Item>
              ))}
            </List>
          ) : tournaments.length > 0 ? (
            <List>
              {tournaments.map((t) => (
                <List.Item key={t.id}>{t.name}</List.Item>
              ))}
            </List>
          ) : (
            <Text c="dimmed">No tournaments found</Text>
          )}
        </>
      )}
    </Container>
  );
}
