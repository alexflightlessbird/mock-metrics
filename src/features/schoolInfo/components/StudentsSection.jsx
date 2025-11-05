import { useSchoolStudents } from "../../../common/hooks/useSchoolDetails";
import { useArchiveStudent, useUnarchiveStudent } from "../hooks/useArchiveStudent";
import Loader from "../../../common/components/loader/GavelLoader";
import { Skeleton, Stack } from "@mantine/core";
import AddStudentModal from "./AddStudentModal";
import AddButton from "../../../common/components/AddButton";
import SearchableSection from "./SearchableSection";

export default function StudentsSection({ schoolId, role, isMobile, navigate }) {
    const { data: students = [], isLoading: studentsLoading = true } = useSchoolStudents(schoolId);
    const { mutate: archiveStudent } = useArchiveStudent();
    const { mutate: unarchiveStudent } = useUnarchiveStudent();

    if (studentsLoading) return (
        <Stack>
            <Skeleton height={50} width="100%" />
            <Loader scale={1.5} />
        </Stack>
    );

    return (
        <SearchableSection
            items={students}
            onArchive={(studentId) => archiveStudent({ studentId, schoolId })}
            onUnarchive={(studentId) => unarchiveStudent({ studentId, schoolId })}
            isMobile={isMobile}
            navigateLink="/school/s/"
            sectionName="students"
            addModal={<AddStudentModal schoolId={schoolId} trigger={<AddButton w={isMobile ? "100%" : "auto"}>Add Student</AddButton>} />}
            role={role}
            navigate={navigate}
        />
    )
}