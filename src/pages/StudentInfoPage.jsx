import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGetRole } from "../common/hooks/useGetRole";
import {
  useStudentDetails,
  useStudentTeams,
} from "../common/hooks/useStudentDetails";
import { useSchoolTeams } from "../common/hooks/useSchoolDetails";
import BasePage from "../common/components/BasePage";
import {
  Button,
  Divider,
  Flex,
  Select,
  Space,
  Text,
} from "@mantine/core";
import { LuArrowLeft, LuTrash } from "react-icons/lu";
import Loader from "../common/components/loader/GavelLoader";
import PageSection from "../common/components/PageSection";
import DeleteConfirmationModal from "../common/components/modals-new/DeleteConfirmationModal";
import PageDetailSection from "../common/components/PageDetailSection";

export default function StudentInfoPage() {
  const [selectedSchoolId] = useLocalStorage({
    key: "school",
    defaultValue: null,
  });
  const [editMode, setEditMode] = useState(false);
  const { id: studentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentTeamId, setCurrentTeamId] = useState(null);
  const [initialCurrentTeam, setInitialCurrentTeam] = useState(null);

  const { role } = useGetRole(user.id, selectedSchoolId);

  const {
    data: selectedStudent,
    isLoading: studentLoading = true,
    deleteStudent,
    updateStudent,
  } = useStudentDetails(studentId);
  const {
    data: studentTeams,
    isLoading: studentTeamsLoading = true,
    removeTeamFromStudent,
    addTeamToStudent,
  } = useStudentTeams(studentId);
  const { data: allTeams, isLoading: allTeamsLoading = true } =
    useSchoolTeams(selectedSchoolId);

  useEffect(() => {
    setCurrentTeamId(studentTeams?.find((st) => st.is_active)?.team_id || null);
    setInitialCurrentTeam(studentTeams?.find((st) => st.is_active) || null);
  }, [studentTeams]);

  const availableTeams = useMemo(() => {
    return allTeams
      ?.filter((t) => t.is_active)
      .map((t) => ({
        value: t.id,
        label: `${t.name} (${t.year}${
          t.type === "pre-stack"
            ? " Pre-Stack"
            : t.type === "post-stack"
            ? " Post-Stack"
            : ""
        })`,
      }));
  }, [allTeams]);

  if (studentLoading || studentTeamsLoading || allTeamsLoading)
    return (
      <BasePage titleText="Loading...">
        <Loader scale={1.5} />
      </BasePage>
    );

  if (!selectedStudent || Object.keys(selectedStudent).length === 0)
    return (
      <BasePage titleText="Invalid Student">
        <Text>Please check the student ID and try again.</Text>
      </BasePage>
    );

  const handleSave = async ({ title }) => {
    const updates = {};

    if (title !== selectedStudent.name) {
      updates.name = title;
    }

    if (currentTeamId !== initialCurrentTeam?.team_id) {
      if (currentTeamId === null) {
        if (initialCurrentTeam !== null) {
          await updateStudent({ updates, other: true });
          await removeTeamFromStudent({
            studentId,
            teamId: initialCurrentTeam?.team_id,
          });
        } else {
          await updateStudent({ updates, other: false });
        }
      } else {
        await updateStudent({ updates, other: true });
        await addTeamToStudent({ studentId, teamId: currentTeamId });
      }
    } else {
      await updateStudent({ updates, other: false });
    }

    setEditMode(false);
  };

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
      titleText={selectedStudent.name}
      editEnabled={role === "admin" || role === "primary"}
      editMode={editMode}
      setEditMode={setEditMode}
      editableTitle={true}
      onSave={handleSave}
    >
      <Button
        mb="sm"
        leftSection={<LuArrowLeft />}
        onClick={() => navigate("/school")}
      >
        School
      </Button>

      <Text c="dimmed" fz="sm" mb="sm">
        Last Updated:{" "}
        {new Date(selectedStudent?.updated_at + "Z").toLocaleString()}
      </Text>

      <Divider mb="md" />

      <PageDetailSection
        editable={editMode}
        details={[
          { name: "Current Team", value: editMode ? (
            <Select
              value={currentTeamId}
              onChange={setCurrentTeamId}
              data={availableTeams}
              style={styleProps}
            />
          ) : initialCurrentTeam?.teams?.name || "Not currently assigned to a team" },
          { type: "id", name: "Student", value: selectedStudent.id }
        ]}
      />

      <Space h="md" />

      {role === "primary" && (
        <>
          <PageSection title="danger zone">
            <Flex gap="xl" align="center">
              <Text flex={1} c="red" fw={700} size="sm">
                THIS ACTION CANNOT BE REVERSED. PLEASE PROCEED WITH CAUTION.
              </Text>
              <DeleteConfirmationModal
                trigger={
                  <Button
                    w="fit-content"
                    leftSection={<LuTrash />}
                    color="red"
                    variant="outline"
                  >
                    Delete Student
                  </Button>
                }
                includeBallots={true}
                onSubmit={() => {
                  deleteStudent({
                    studentId: selectedStudent.id,
                    schoolId: selectedSchoolId,
                  });
                  navigate("/school");
                }}
                entity={{
                  name: selectedStudent.name,
                }}
                entityName="student"
              />
            </Flex>
          </PageSection>
        </>
      )}
    </BasePage>
  );
}
