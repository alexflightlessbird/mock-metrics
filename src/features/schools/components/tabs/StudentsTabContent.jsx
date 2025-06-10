import { useActiveFilters } from "../../../../common/hooks/useActiveFilters";
import StudentList from "../lists/SingleSchool/StudentList";
import StudentFilters from "../filters/StudentFilters";
import IconButton from "../../../../common/components/IconButton";
import FormModal from "../../../../common/components/FormModal";
import { useStudentFilters } from "../../hooks/useSingleSchoolTabs";

export default function StudentsTabContent({
    allStudents,
    hasAddPermissions,
    addStudentForm
}) {
    const { active: activeStudents, inactive: inactiveStudents } = useActiveFilters(allStudents);
    const { status, setStatus } = useStudentFilters();

    const currentStatus = (status === "inactive" && inactiveStudents.length === 0) || (status === "active" && activeStudents.length === 0) ? "all" : status;

    function getFilteredStudents () {
        switch (status) {
            case "active": return activeStudents;
            case "inactive": return inactiveStudents;
            case "all": return [...activeStudents, ...inactiveStudents];
            default: return activeStudents;
        }
    }

    const modalProps = {
        opened: addStudentForm.opened,
        onClose: addStudentForm.close,
        title: "Add Student to School",
        onSubmit: addStudentForm.handleSubmit,
        form: addStudentForm.form,
        fields: [
            {
                type: "text",
                name: "name",
                autofocus: true,
                placeholder: "Enter the student's name",
                required: true,
                label: "Name"
            }
        ]
    }

    return (
        <>
            <br />
            {hasAddPermissions && (
                <>
                    <IconButton icon="add" buttonText="Add Student" onClick={addStudentForm.open} />
                    <FormModal {...modalProps} />
                    <br />
                    <br />
                </>
            )}
            <StudentFilters
                statusValue={currentStatus}
                onStatusChange={setStatus}
                activeStudents={activeStudents}
                inactiveStudents={inactiveStudents}
                disabled={allStudents.length === 0}
            />
            <StudentList students={getFilteredStudents()} />
        </>
    )
}