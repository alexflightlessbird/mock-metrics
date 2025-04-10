// Dependency imports
import { Link } from "react-router-dom";
import { Flex, Text } from "@mantine/core";
import { modals } from "@mantine/modals";

// Component imports
import List from "../../../../../common/components/List";
import { DeleteIcon } from "../../../../../common/components/ActionIcons";

// Utils imports
import { ROLES } from "../../../../../utils/constants";

// Hooks imports
import { useSchoolDataMutations } from "../../../../../hooks/api/useSchoolData";

export default function TeamStudentList({ students, schoolRole }) {
    const { updateStudent } = useSchoolDataMutations();
    function removeStudentModal (student) {
        modals.openConfirmModal({
            title: `Remove Student: ${student.students.name}`,
            centered: true,
            children: (
                <Text>
                    Are you sure you want to remove {student.students.name} from {student.teams.name}?
                </Text>
            ),
            labels: { confirm: "Remove", cancel: "Cancel" },
            onConfirm: async () => {
                try {
                    await updateStudent({
                        studentId: student.student_id,
                        name: undefined,
                        is_active: undefined,
                        newTeamId: null,
                        originalTeamId: student.team_id,
                        schoolId: student.teams.school_id
                    });
                    modals.closeAll();
                } catch (error) {
                    console.error("Student removal failed:", error);
                }
            }
        })
    }

    const mappedStudents = [];
    students.map((s) => mappedStudents.push(
        <Flex style={{ alignItems: "center", gap: "7px" }} key={s.student_id}>
            <Link to={`/schools?schoolId=${s.students.school_id}&studentId=${s.student_id}`}>{s.students.name}</Link>
            {[ROLES.PRIMARY, ROLES.ADMIN].includes(schoolRole) && (
                <DeleteIcon onClick={() => removeStudentModal(s)} />
            )}
        </Flex>
    ));
    if (mappedStudents.length == 0) mappedStudents.push("None");
    return <List items={mappedStudents} />
}