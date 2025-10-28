import {
  Text,
  Space,
  Select,
  Skeleton,
  Stack,
  Divider,
  TextInput,
  Group,
  Title,
  List,
  SegmentedControl,
  Flex,
  ActionIcon,
  Grid,
  Tooltip,
} from "@mantine/core";
import { useAuth } from "../context/AuthContext";
import { useUserAssignments } from "../common/hooks/useUserAssignments";
import {
  useSchoolDetails,
  useSchoolUsers,
  useSchoolTeams,
  useSchoolStudents,
} from "../common/hooks/useSchoolDetails";
import { useArchiveStudent, useUnarchiveStudent } from "../features/schoolInfo/hooks/useArchiveStudent";
import { useArchiveTeam, useUnarchiveTeam } from "../features/schoolInfo/hooks/useArchiveTeam";
import { useMobile } from "../context/MobileContext";
import { useLocalStorage } from "@mantine/hooks";
import { capitalize } from "../common/utils/helpers";
import BasePage from "../common/components/BasePage";
import ShowIdText from "../common/components/ShowIdText";
import PageSection from "../common/components/PageSection";
import { useQueryClient } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { LuArchive, LuArchiveRestore, LuSearch, LuX } from "react-icons/lu";
import AddButton from "../common/components/AddButton";
import Card from "../common/components/card/Card";
import AddTeamModal from "../features/schoolInfo/components/AddTeamModal";
import AddStudentModal from "../features/schoolInfo/components/AddStudentModal";

export default function SchoolInfoPage() {
  const { user } = useAuth();
  const { isMobile } = useMobile();

  const [teamSearchValue, setTeamSearchValue] = useState("");
  const [teamFilter, setTeamFilter] = useState("active");
  
  const [studentSearchValue, setStudentSearchValue] = useState("");
  const [studentFilter, setStudentFilter] = useState("active");

  const { assignments, isLoading } = useUserAssignments(user.id);
  const queryClient = useQueryClient();

  const [primaryAdmins, setPrimaryAdmins] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [viewers, setViewers] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [schoolShortName, setSchoolShortName] = useState(null);

  const [selectedSchoolId, setSelectedSchoolId] = useLocalStorage({
    key: "school",
    defaultValue: null,
  });

  const {
    data: schoolInformation = {},
    isLoading: schoolLoading = true,
    updateSchool,
  } = useSchoolDetails(selectedSchoolId);

  const { data: teams = [], isLoading: teamsLoading = true } =
    useSchoolTeams(selectedSchoolId);
  const { mutate: archiveTeam } = useArchiveTeam();
  const { mutate: unarchiveTeam } = useUnarchiveTeam();

  const { data: students = [], isLoading: studentsLoading = true } =
    useSchoolStudents(selectedSchoolId);
  const { mutate: archiveStudent } = useArchiveStudent();
  const { mutate: unarchiveStudent } = useUnarchiveStudent();
  
  const { data: users = [], isLoading: usersLoading = true } =
    useSchoolUsers(selectedSchoolId);

  useEffect(() => {
    setSchoolShortName(schoolInformation?.short_name);
  }, [schoolInformation]);

  useEffect(() => {
    if (usersLoading) return;
    const parimaryAdmins = users.filter((u) => u.role === "primary");
    const admins = users.filter((u) => u.role === "admin");
    const viewers = users.filter((u) => u.role === "viewer");

    setPrimaryAdmins(parimaryAdmins);
    setAdmins(admins);
    setViewers(viewers);
  }, [users, usersLoading]);

  const filteredTeams = useMemo(() => {
    const filteredActive = teams?.filter((t) => t.is_active);
    const filteredInactive = teams?.filter((t) => !t.is_active);

    const filterBySearch = (teams) => {
      let result = teams;
      if (teamSearchValue) {
        result = result?.filter((t) => t.name.toLowerCase().includes(teamSearchValue.toLowerCase()));
      }
      return result?.sort((a, b) => b.year - a.year || a.name.localeCompare(b.name));
    }

    switch (teamFilter) {
      case "active":
        return filterBySearch(filteredActive);
      case "inactive":
        return filterBySearch(filteredInactive);
      default:
        return filterBySearch(teams);
    }
  }, [teams, teamFilter, teamSearchValue]);

  const filteredStudents = useMemo(() => {
    const filteredActive = students?.filter((s) => s.is_active);
    const filteredInactive = students?.filter((s) => !s.is_active);

    const filterBySearch = (students) => {
      let result = students;
      if (studentSearchValue) {
        result = result?.filter((s) => s.name.toLowerCase().includes(studentSearchValue.toLowerCase()));
      }
      return result.sort((a, b) => a.name.localeCompare(b.name));
    }

    switch (studentFilter) {
      case "active":
        return filterBySearch(filteredActive);
      case "inactive":
        return filterBySearch(filteredInactive);
      default:
        return filterBySearch(students);
    }
  }, [students, studentFilter, studentSearchValue]);

  if (!isLoading && !schoolInformation) {
    queryClient.invalidateQueries(["user-assignments", user.id]);
    return <Navigate to="/school" replace />;
  }

  const schoolOptions = assignments.map((a) => ({
    value: a.school_id,
    label: `${a.schools.name} (${a.schools?.short_name || ""})`,
  }));

  const handleSave = async ({ title }) => {
    const updates = {};

    if (title !== schoolInformation.name) {
      updates.name = title;
    }
    if (schoolShortName !== schoolInformation.short_name) {
      updates.short_name = schoolShortName;
    }

    await updateSchool(updates);
    setEditMode(false);
  };

  if (!selectedSchoolId)
    return (
      <BasePage titleText="Well this is awkward...">
        <Text>
          We're not sure how you got to this page, but you haven't selected a
          school yet.
        </Text>
        <Text>Select a school to continue.</Text>
        <Space h="md" />
        <Select
          data={schoolOptions}
          value={selectedSchoolId}
          onChange={setSelectedSchoolId}
          allowDeselect={false}
        />
      </BasePage>
    );

  const role = assignments.find((a) => a.school_id === selectedSchoolId)?.role;

  if (schoolLoading || isLoading || teamsLoading || studentsLoading || usersLoading)
    return (
      <BasePage titleText="School Loading...">
        <Stack>
          <Skeleton height={20} width={200} />
          <Skeleton height={20} width={200} />
          <Skeleton height={20} width={200} />
          <Skeleton height={20} width={200} />
        </Stack>
      </BasePage>
    );

  return (
    <BasePage
      titleText={schoolInformation.name}
      editEnabled={role === "primary"}
      editMode={editMode}
      setEditMode={setEditMode}
      editableTitle={true}
      onSave={handleSave}
    >
      <Text c="dimmed" fz="sm" mb="sm">
        Last Updated:{" "}
        {new Date(schoolInformation?.updated_at + "Z").toLocaleString()}
      </Text>

      <Divider mb="md" />

      <Group justify="space-between" align="flex-start" mb="xs">
        <Stack gap="0">
          <Text c="dimmed" fz="sm">
            Short Name
          </Text>
          {editMode && (
            <TextInput
              value={schoolShortName}
              onChange={(e) => setSchoolShortName(e.target.value)}
              style={{
                fontSize: "1.875rem",
                fontWeight: 700,
                lineHeight: 1.2,
                border: "none",
                borderBottom: "2px solid #000",
                outline: "none",
                marginRight: "10px",
              }}
            />
          )}
          {!editMode && <Text fz="sm">{schoolInformation.short_name}</Text>}
        </Stack>
        <Stack gap="0">
          <Text c="dimmed" fz="sm">
            Premium Status
          </Text>
          <Text fz="sm">
            {schoolInformation.is_premium ? "Active" : "Inactive"}
          </Text>
        </Stack>
        <Stack gap="0">
          <Text c="dimmed" fz="sm">
            Your Role
          </Text>
          <Text fz="sm">
            {role === "primary" ? "Primary Admin" : capitalize(role)}
          </Text>
        </Stack>
        <ShowIdText idName="School" idValue={selectedSchoolId} />
      </Group>

      <Space h="md" />

      {/* TODO: IMPLEMENT USER MANAGEMENT */}
      <PageSection title="users" collapsible={true}>
        <Text>User management is not implemented yet.</Text>
        <Title order={4}>Primary Admins</Title>
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
        <Title order={4}>Admins</Title>
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
        <Title order={4}>Viewers</Title>
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
      </PageSection>

      <Space h="md" />

      <PageSection title="teams" collapsible={true}>
        <SegmentedControl fullWidth value={teamFilter} onChange={setTeamFilter} data={[ { label: "All", value: "all" }, { label: "Current", value: "active" }, { label: "Archived", value: "inactive" } ]} mb="md" />
        <Flex direction={isMobile ? "column" : "row"} gap="sm" mb="md" align="center">
          <Flex direction="row" flex={1} gap="xs" w={isMobile ? "100%" : undefined}>
            <TextInput
              id={"search-team"}
              w={isMobile ? "100%" : undefined}
              flex={1}
              leftSection={<LuSearch />}
              rightSection={
                teamSearchValue && (
                  <ActionIcon
                    variant="transparent"
                    onClick={() => {
                      setTeamSearchValue("");
                      document.getElementById("search-team").focus();
                    }}
                  >
                    <LuX />
                  </ActionIcon>
                )
              }
              placeholder="Search..."
              value={teamSearchValue}
              onChange={(e) => setTeamSearchValue(e.target.value)}
            />
          </Flex>
          {(role === "admin" || role === "primary") && (
            <AddTeamModal
              schoolId={selectedSchoolId}
              trigger={
                <AddButton w={isMobile ? "100%" : "auto"}>
                  Add Team
                </AddButton>
              }
            />
          )}
        </Flex>
        {!filteredTeams || filteredTeams.length === 0 ? (
          <Text ta="center" c="dimmed" mt="md">
            No {teamFilter === "inactive" ? " archived" : teamFilter === "active" ? " current" : ""} teams found.
          </Text>
        ) : (
          <Grid>
            {filteredTeams.map((t) => (
              <Grid.Col key={t.id} span={{ base: 12, md: 6, xl: 4 }}>
                <Card>
                  <Flex justify="space-between" align="center">
                    <Title order={5}>{t.name}</Title>
                    {(role === "admin" || role === "primary") && (
                      <Tooltip
                        label={t.is_active ? "Archive Team" : "Unarchive Team"}
                        withArrow
                      >
                        <ActionIcon
                          variant="subtle"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (t.is_active) {
                              archiveTeam({
                                teamId: t.id,
                                schoolId: selectedSchoolId,
                              });
                            } else {
                              unarchiveTeam({
                                teamId: t.id,
                                schoolId: selectedSchoolId,
                              });
                            }
                          }}
                        >
                          {t.is_active ? <LuArchive /> : <LuArchiveRestore />}
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </Flex>
                  <Text>{t.year}</Text>
                  <Text tt="capitalize" c="dimmed">
                    {t.type}
                  </Text>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        )}
      </PageSection>

      <Space h="md" />

      <PageSection title="students" collapsible={true}>
        <SegmentedControl fullWidth value={studentFilter} onChange={setStudentFilter} data={[ { label: "All", value: "all" }, { label: "Current", value: "active" }, { label: "Archived", value: "inactive" } ]} mb="md" />
        <Flex direction={isMobile ? "column" : "row"} gap="sm" mb="md" align="center">
          <Flex direction="row" flex={1} gap="xs" w={isMobile ? "100%" : undefined}>
            <TextInput
              id={"search-student"}
              w={isMobile ? "100%" : undefined}
              flex={1}
              leftSection={<LuSearch />}
              rightSection={
                studentSearchValue && (
                  <ActionIcon
                    variant="transparent"
                    onClick={() => {
                      setStudentSearchValue("");
                      document.getElementById("search-student").focus();
                    }}
                  >
                    <LuX />
                  </ActionIcon>
                )
              }
              placeholder="Search..."
              value={studentSearchValue}
              onChange={(e) => setStudentSearchValue(e.target.value)}
            />
          </Flex>
          {(role === "admin" || role === "primary") && (
            <AddStudentModal
              schoolId={selectedSchoolId}
              trigger={
                <AddButton w={isMobile ? "100%" : "auto"}>
                  Add Student
                </AddButton>
              }
            />
          )}
        </Flex>
        {!filteredStudents || filteredStudents.length === 0 ? (
          <Text ta="center" c="dimmed" mt="md">
            No {studentFilter === "inactive" ? " archived" : studentFilter === "active" ? " current" : ""} students found.
          </Text>
        ) : (
          <Grid>
            {filteredStudents.map((s) => (
              <Grid.Col key={s.id} span={{ base: 12, md: 6, xl: 4 }}>
                <Card>
                  <Flex justify="space-between" align="center">
                    <Title order={5}>{s.name}</Title>
                    {(role === "admin" || role === "primary") && (
                      <Tooltip
                        label={s.is_active ? "Archive Student" : "Unarchive Student"}
                        withArrow
                      >
                        <ActionIcon
                          variant="subtle"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (s.is_active) {
                              archiveStudent({
                                studentId: s.id,
                                schoolId: selectedSchoolId,
                              });
                            } else {
                              unarchiveStudent({
                                studentId: s.id,
                                schoolId: selectedSchoolId,
                              });
                            }
                          }}
                        >
                          {s.is_active ? <LuArchive /> : <LuArchiveRestore />}
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </Flex>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        )}
      </PageSection>
    </BasePage>
  );
}
