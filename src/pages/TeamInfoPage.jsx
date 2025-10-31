import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGetRole } from "../common/hooks/useGetRole";
import { useTeamDetails, useTeamStudents } from "../common/hooks/useTeamDetails";
import { useSchoolStudents } from "../common/hooks/useSchoolDetails";
import { useCaseDetails } from "../common/hooks/useCaseDetails";
import { useCasesData } from "../common/hooks/useCasesData";
import BasePage from "../common/components/BasePage";
import { ActionIcon, Button, Divider, Flex, Grid, Group, NumberInput, Select, Space, Stack, Text, Title, Tooltip } from "@mantine/core";
import { LuArrowLeft, LuTrash, LuX } from "react-icons/lu";
import Loader from "../common/components/loader/GavelLoader";
import ShowIdText from "../common/components/ShowIdText";
import PageSection from "../common/components/PageSection";
import DeleteConfirmationModal from "../common/components/modals-new/DeleteConfirmationModal";
import AddButton from "../common/components/AddButton";
import Card from "../common/components/card/Card";
import AddStudentToTeamModal from "../features/teamInfo/components/AddStudentToTeamModal";

export default function TeamInfoPage() {
    const [selectedSchoolId] = useLocalStorage({
        key: "school",
        defaultValue: null,
    });
    const [editMode, setEditMode] = useState(false);
    const { id: teamId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [teamYear, setTeamYear] = useState(null);
    const [teamType, setTeamType] = useState(null);
    const [teamCase, setTeamCase] = useState(null);

    const { role } = useGetRole(
        user.id,
        selectedSchoolId
    );

    const {
        data: selectedTeam,
        isLoading: teamLoading = true,
        deleteTeam,
        updateTeam
    } = useTeamDetails(teamId);
    const { data: teamStudents, isLoading: teamStudentsLoading = true, removeStudentFromTeam } = useTeamStudents(teamId);
    const { data: allStudents, isLoading: allStudentsLoading = true } = useSchoolStudents(selectedSchoolId);
    const { data: caseDetails, isLoading: caseDetailsLoading = true } = useCaseDetails(selectedTeam?.case_id);
    const { data: allCases, isLoading: allCasesLoading = true } = useCasesData();

    useEffect(() => {
        setTeamYear(selectedTeam?.year);
        setTeamType(selectedTeam?.type);
        setTeamCase(selectedTeam?.case_id);
    }, [selectedTeam]);

    if (teamLoading || teamStudentsLoading || allStudentsLoading || caseDetailsLoading || allCasesLoading) return (
        <BasePage titleText="Loading...">
            <Loader scale={1.5} />
        </BasePage>
    );

    if (!selectedTeam || Object.keys(selectedTeam).length === 0)
        return (
            <BasePage titleText="Invalid Team">
                <Text>Please check the team ID and try again.</Text>
            </BasePage>
        );

    const handleSave = async ({ title }) => {
        const updates = {};

        if (title !== selectedTeam.name) {
            updates.name = title;
        }
        if (teamYear !== selectedTeam.year) {
            updates.year = teamYear;
        }
        if (teamType !== selectedTeam.type) {
            updates.type = teamType;
        }
        if (teamCase !== selectedTeam.case_id) {
            updates.case_id = teamCase;
        }
        await updateTeam(updates);
        setEditMode(false);
    };

    return (
        <BasePage
            titleText={selectedTeam.name}
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
                {new Date(selectedTeam?.updated_at + "Z").toLocaleString()}
            </Text>

            <Divider mb="md" />

            <Group justify="space-between" align="flex-start" mb="xs">
                <Stack gap="0">
                    <Text c="dimmed" fz="sm">
                        Year
                    </Text>
                    {editMode && (
                        <NumberInput
                            value={teamYear}
                            onChange={(e) => setTeamYear(e)}
                            min={1980}
                            max={new Date().getFullYear() + 1}
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
                    {!editMode && <Text fz="sm">{selectedTeam.year}</Text>}
                </Stack>
                <Stack gap="0">
                    <Text c="dimmed" fz="sm">
                        Type
                    </Text>
                    {editMode && (
                        <Select
                            value={teamType}
                            onChange={setTeamType}
                            data={[
                                { value: "pre-stack", label: "Pre-Stack" },
                                { value: "post-stack", label: "Post-Stack" },
                            ]}
                            style={{
                                fontSize: "1.875rem",
                                fontWeight: 700,
                                lineHeight: 1.2,
                                border: "none",
                                borderBottom: "2px solid #000",
                                outline: "none",
                                marginRight: "10px"
                            }}
                        />
                    )}
                    {!editMode && (
                        <Text fz="sm">
                            {selectedTeam.type === "pre-stack"
                                ? "Pre-Stack"
                                : selectedTeam.type === "post-stack"
                                ? "Post-Stack"
                                : ""}
                        </Text>
                    )}
                </Stack>
                <Stack gap="0">
                    <Text c="dimmed" fz="sm">
                        Associated Case
                    </Text>
                    {editMode && allCases.filter((c) => c.is_active).length > 1 && (
                        <Select
                            value={teamCase}
                            onChange={setTeamCase}
                            data={
                                allCases.filter((c) => c.is_active).map((c) => {
                                    return { value: c.id, label: c.name + " (" + c.year + ")" }
                                })
                            }
                            style={{
                                fontSize: "1.875rem",
                                fontWeight: 700,
                                lineHeight: 1.2,
                                border: "none",
                                borderBottom: "2px solid #000",
                                outline: "none",
                                marginRight: "10px"
                            }}
                        />
                    )}
                    {(!editMode || allCases.filter((c) => c.is_active).length <= 1) && (
                        <Text fz="sm">
                            {caseDetails && caseDetails.name + " (" + caseDetails.year + ")"}
                        </Text>
                    )}
                </Stack>
                <ShowIdText fz="sm" idName="Team" idValue={selectedTeam.id} />
            </Group>

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
                                        Delete Team
                                    </Button>
                                }
                                includeBallots={true}
                                onSubmit={() => {
                                    deleteTeam();
                                    navigate("/school");
                                }}
                                entity={{
                                    name: selectedTeam.name,
                                }}
                                entityName="team"
                            />
                        </Flex>
                    </PageSection>
                    <Space h="md" />
                </>
            )}

            <PageSection title="students">
                {selectedTeam.is_active && 
                    (role === "admin" || role === "primary") && (
                        <AddStudentToTeamModal
                            trigger={<AddButton>Add Student to Team</AddButton>}
                            teamId={selectedTeam.id}
                            schoolId={selectedSchoolId}
                            teamName={selectedTeam.name}
                            existingStudentIds={teamStudents.map((s) => s.student_id)}
                            allStudents={allStudents}
                        />
                    )
                }
                {teamStudents.length === 0 ? (
                    <Text ta="center" c="dimmed" mt="md">
                        No students found for this team.
                    </Text>
                ) : (
                    <Grid>
                        {teamStudents.map((s) => (
                            <Grid.Col key={s.student_id} span={{ base: 12, md: 6, xl: 4 }}>
                                <Card onClick={() => navigate("/school/s/" + s.student_id)}>
                                    <Flex justify="space-between" align="center">
                                        <Title order={5}>{s.students.name}</Title>
                                        {(role === "admin" || role === "primary") && selectedTeam.is_active && (
                                            <Tooltip
                                                label={"Remove " + s.students.name + " from " + selectedTeam.name}
                                                withArrow
                                            >
                                                <ActionIcon
                                                    variant="subtle"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeStudentFromTeam({ studentId: s.student_id, teamId: selectedTeam.id });
                                                    }}
                                                >
                                                    <LuX />
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
    )
}