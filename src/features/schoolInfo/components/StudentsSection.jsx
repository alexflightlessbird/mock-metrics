import { useMemo, useState } from "react";
import { useSchoolStudents } from "../../../common/hooks/useSchoolDetails";
import { useArchiveStudent, useUnarchiveStudent } from "../hooks/useArchiveStudent";
import Loader from "../../../common/components/loader/GavelLoader";
import PageSection from "../../../common/components/PageSection";
import { ActionIcon, Flex, Grid, SegmentedControl, Skeleton, Stack, Text, TextInput, Title } from "@mantine/core";
import { LuSearch, LuX } from "react-icons/lu";
import AddStudentModal from "./AddStudentModal";
import AddButton from "../../../common/components/AddButton";
import Card from "../../../common/components/card/Card";
import ArchiveAction from "../../../common/components/ArchiveAction";

export default function StudentsSection({ schoolId, role, isMobile, navigate }) {
    const [studentSearchValue, setStudentSearchValue] = useState("");
    const [studentFilter, setStudentFilter] = useState("active");

    const { data: students = [], isLoading: studentsLoading = true } = useSchoolStudents(schoolId);
    const { mutate: archiveStudent } = useArchiveStudent();
    const { mutate: unarchiveStudent } = useUnarchiveStudent();

    const filteredStudents = useMemo(() => {
        const filteredActive = students?.filter(s => s.is_active);
        const filteredInactive = students?.filter(s => !s.is_active);

        const filterBySearch = (students) => {
            let result = students;
            if (studentSearchValue) {
                result = result?.filter(s => 
                    s.name.toLowerCase().includes(studentSearchValue.toLowerCase())
                );
            }
            return result?.sort(
                (a, b) => a.name.localeCompare(b.name)
            );
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

    if (studentsLoading) return (
        <Stack>
            <Skeleton height={50} width="100%" />
            <Loader scale={1.5} />
        </Stack>
    );

    return (
        <PageSection title="students" collapsible defaultOpen>
            <SegmentedControl
                fullWidth
                value={studentFilter}
                onChange={setStudentFilter}
                data={[
                    { label: "All", value: "all" },
                    { label: "Current", value: "active" },
                    { label: "Archived", value: "inactive" }
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
                        id="search-student"
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
                        onChange={e => setStudentSearchValue(e.target.value)}
                    />
                </Flex>
                {(role === "admin" || role === "primary") && (
                    <AddStudentModal
                        schoolId={schoolId}
                        trigger={<AddButton w={isMobile ? "100%" : "auto"}>Add Student</AddButton>}
                    />
                )}
            </Flex>
            {!filteredStudents || filteredStudents.length === 0 ? (
                <Text ta="center" c="dimmed" mt="md">
                    No{studentFilter === "inactive" ? " archived " : studentFilter === " active " ? " current " : " "}students found.
                </Text>
            ) : (
                <Grid>
                    {filteredStudents.map(s => (
                        <Grid.Col key={s.id} span={{ base: 12, md: 6, xl: 4 }}>
                            <Card onClick={() => navigate("/school/s/" + s.id)}>
                                <Flex justify="space-between" align="center">
                                    <Title order={5}>{s.name}</Title>
                                    {(role === "admin" || role === "primary") && (
                                        <ArchiveAction
                                            isActive={s.is_active}
                                            onArchive={() => archiveStudent({ studentId: s.id, schoolId })}
                                            onUnarchive={() => unarchiveStudent({ studentId: s.id, schoolId })}
                                        />
                                    )}
                                </Flex>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>
            )}
        </PageSection>
    )
}