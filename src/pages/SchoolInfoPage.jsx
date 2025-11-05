import {
  Text,
  Space,
  Select,
  Skeleton,
  Stack,
  Divider,
  TextInput,
} from "@mantine/core";
import { useAuth } from "../context/AuthContext";
import { useUserAssignments } from "../common/hooks/useUserAssignments";
import { useSchoolDetails } from "../common/hooks/useSchoolDetails";
import { useMobile } from "../context/MobileContext";
import { useLocalStorage } from "@mantine/hooks";
import { capitalize } from "../common/utils/helpers";
import BasePage from "../common/components/BasePage";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PageDetailSection from "../common/components/PageDetailSection";
import TeamsSection from "../features/schoolInfo/components/TeamsSection";
import StudentsSection from "../features/schoolInfo/components/StudentsSection";
import UsersSection from "../features/schoolInfo/components/UsersSection";
import { styleProps } from "../common/editModeStyleProps";

export default function SchoolInfoPage() {
  const { user } = useAuth();
  const { isMobile } = useMobile();
  const navigate = useNavigate();

  const { assignments, isLoading } = useUserAssignments(user.id);
  const queryClient = useQueryClient();

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

  useEffect(() => {
    setSchoolShortName(schoolInformation?.short_name);
  }, [schoolInformation]);

  if (!isLoading && !schoolInformation) {
    queryClient.invalidateQueries(["user-assignments", user.id]);
    return navigate("/school", { replace: true });
  }

  const schoolOptions = assignments.map((a) => ({
    value: a.school_id,
    label: `${a.schools.name} (${a.schools?.short_name || ""})`,
  }));

  const handleSave = async ({ title }) => {
    const updates = {};

    if (title !== schoolInformation.name) updates.name = title;
    if (schoolShortName !== schoolInformation.short_name) updates.short_name = schoolShortName;

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

  if ( schoolLoading || isLoading) return (
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

      <UsersSection schoolId={selectedSchoolId} />

      <Space h="md" />

      <TeamsSection schoolId={selectedSchoolId} role={role} isMobile={isMobile} navigate={navigate} />

      <Space h="md" />

      <StudentsSection schoolId={selectedSchoolId} role={role} isMobile={isMobile} navigate={navigate} />
    </BasePage>
  );
}
