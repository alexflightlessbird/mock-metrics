import {
  Text,
  Space,
  Select,
  Skeleton,
  Stack,
  Divider,
  TextInput,
  Title,
  List,
  SegmentedControl,
  Flex,
  ActionIcon,
  Grid,
} from "@mantine/core";
import { useAuth } from "../context/AuthContext";
import { useUserAssignments } from "../common/hooks/useUserAssignments";
import {
  useSchoolDetails,
  useSchoolUsers,
  useSchoolTeams,
  useSchoolStudents,
} from "../common/hooks/useSchoolDetails";
import {
  useArchiveStudent,
  useUnarchiveStudent,
} from "../features/schoolInfo/hooks/useArchiveStudent";
import {
  useArchiveTeam,
  useUnarchiveTeam,
} from "../features/schoolInfo/hooks/useArchiveTeam";
import { useMobile } from "../context/MobileContext";
import { useLocalStorage } from "@mantine/hooks";
import { capitalize } from "../common/utils/helpers";
import BasePage from "../common/components/BasePage";
import ShowIdText from "../common/components/ShowIdText";
import PageSection from "../common/components/PageSection";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { LuSearch, LuX } from "react-icons/lu";
import AddButton from "../common/components/AddButton";
import Card from "../common/components/card/Card";
import AddTeamModal from "../features/schoolInfo/components/AddTeamModal";
import AddStudentModal from "../features/schoolInfo/components/AddStudentModal";
import ArchiveAction from "../common/components/ArchiveAction";
import PageDetailSection from "../common/components/PageDetailSection";

export default function SchoolInfoPage() {
  const { user } = useAuth();
  const { isMobile } = useMobile();
  const navigate = useNavigate();

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
        result = result?.filter((t) =>
          t.name.toLowerCase().includes(teamSearchValue.toLowerCase())
        );
      }
      return result?.sort(
        (a, b) => b.year - a.year || a.name.localeCompare(b.name)
      );
    };

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
        result = result?.filter((s) =>
          s.name.toLowerCase().includes(studentSearchValue.toLowerCase())
        );
      }
      return result.sort((a, b) => a.name.localeCompare(b.name));
    };

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

  if (
    schoolLoading ||
    isLoading ||
    teamsLoading ||
    studentsLoading ||
    usersLoading
  )
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

  const styleProps = {
    fontSize: "1.875rem",
    fontWeight: 700,
    lineHeight: 1.2,
    border: "none",
    borderBottom: "2px solid #000",
    outline: "none",
    marginRight: "10px",
  };

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

      <PageDetailSection
        editable={editMode}
        details={[
          { name: "Short Name", value: editMode ? (
              <TextInput 
                value={schoolShortName}
                onChange={e => setSchoolShortName(e.target.value)}
                style={styleProps}
              />
            ) : schoolInformation.short_name },
            { name: "Premium Status", value: schoolInformation.is_premium ? "Active" : "Inactive" },
            { name: "Your Role", value: role === "primary" ? "Primary Admin" : capitalize(role) },
            { type: "id", name: "School", value: selectedSchoolId }
        ]}
      />

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

      <PageSection title="teams" collapsible={true} defaultOpen={true}>
        <SegmentedControl
          fullWidth
          value={teamFilter}
          onChange={setTeamFilter}
          data={[
            { label: "All", value: "all" },
            { label: "Current", value: "active" },
            { label: "Archived", value: "inactive" },
          ]}
          mb="md"
        />
        <Flex
          direction={isMobile ? "column" : "row"}
          gap="sm"
          mb="md"
          align="center"
        >
          <Flex
            direction="row"
            flex={1}
            gap="xs"
            w={isMobile ? "100%" : undefined}
          >
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
                <AddButton w={isMobile ? "100%" : "auto"}>Add Team</AddButton>
              }
            />
          )}
        </Flex>
        {!filteredTeams || filteredTeams.length === 0 ? (
          <Text ta="center" c="dimmed" mt="md">
            No{" "}
            {teamFilter === "inactive"
              ? " archived"
              : teamFilter === "active"
              ? " current"
              : ""}{" "}
            teams found.
          </Text>
        ) : (
          <Grid>
            {filteredTeams.map((t) => (
              <Grid.Col key={t.id} span={{ base: 12, md: 6, xl: 4 }}>
                <Card onClick={() => navigate("/school/t/" + t.id)}>
                  <Flex justify="space-between" align="center">
                    <Title order={5}>{t.name}</Title>
                    {(role === "admin" || role === "primary") && (
                      <ArchiveAction
                        isActive={t.is_active}
                        onArchive={() =>
                          archiveTeam({
                            teamId: t.id,
                            schoolId: selectedSchoolId,
                          })
                        }
                        onUnarchive={() =>
                          unarchiveTeam({
                            teamId: t.id,
                            schoolId: selectedSchoolId,
                          })
                        }
                      />
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

      <PageSection title="students" collapsible={true} defaultOpen={true}>
        <SegmentedControl
          fullWidth
          value={studentFilter}
          onChange={setStudentFilter}
          data={[
            { label: "All", value: "all" },
            { label: "Current", value: "active" },
            { label: "Archived", value: "inactive" },
          ]}
          mb="md"
        />
        <Flex
          direction={isMobile ? "column" : "row"}
          gap="sm"
          mb="md"
          align="center"
        >
          <Flex
            direction="row"
            flex={1}
            gap="xs"
            w={isMobile ? "100%" : undefined}
          >
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
            No{" "}
            {studentFilter === "inactive"
              ? " archived"
              : studentFilter === "active"
              ? " current"
              : ""}{" "}
            students found.
          </Text>
        ) : (
          <Grid>
            {filteredStudents.map((s) => (
              <Grid.Col key={s.id} span={{ base: 12, md: 6, xl: 4 }}>
                <Card onClick={() => navigate("/school/s/" + s.id)}>
                  <Flex justify="space-between" align="center">
                    <Title order={5}>{s.name}</Title>
                    {(role === "admin" || role === "primary") && (
                      <ArchiveAction
                        isActive={s.is_active}
                        onArchive={() =>
                          archiveStudent({
                            studentId: s.id,
                            schoolId: selectedSchoolId,
                          })
                        }
                        onUnarchive={() =>
                          unarchiveStudent({
                            studentId: s.id,
                            schoolId: selectedSchoolId,
                          })
                        }
                      />
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
