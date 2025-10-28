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
} from "@mantine/core";
import { useAuth } from "../context/AuthContext";
import { useUserAssignments } from "../common/hooks/useUserAssignments";
import {
  useSchoolDetails,
  useSchoolUsers,
  useSchoolTeams,
  useSchoolStudents,
} from "../common/hooks/useSchoolDetails";
import { useLocalStorage } from "@mantine/hooks";
import { capitalize } from "../common/utils/helpers";
import BasePage from "../common/components/BasePage";
import ShowIdText from "../common/components/ShowIdText";
import PageSection from "../common/components/PageSection";
import { useQueryClient } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SchoolInfoPage() {
  const { user } = useAuth();
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
  const { data: students = [], isLoading: studentsLoading = true } =
    useSchoolStudents(selectedSchoolId);
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

  if (schoolLoading || isLoading)
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
    </BasePage>
  );
}
