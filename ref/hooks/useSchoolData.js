import useFetchData from "./useFetchData";
import {
    fetchSchoolData,
    fetchSchoolTeams,
    fetchSchoolTournaments,
    fetchSchoolStudents,
    fetchSchoolRole,
    fetchSchoolAssignees
} from "../services/api/schoolApi";

export default function useSchoolData(schoolId, userId) {
    const {data: school, loading: schoolLoading, error: schoolError } = useFetchData(() => fetchSchoolData(schoolId), false, [schoolId]);
    const {data: teams, loading: teamsLoading, error: teamsError } = useFetchData(() => fetchSchoolTeams(schoolId), true, [schoolId]);
    const {data: tournaments, loading: tournamentsLoading, error: tournamentsError} = useFetchData(() => fetchSchoolTournaments(schoolId), false, [schoolId]);
    const {data: students, loading: studentsLoading, error: studentsError} = useFetchData(() => fetchSchoolStudents(schoolId), false, [schoolId]);
    const {data: roleData, loading: roleLoading, error: roleError } = useFetchData(() => fetchSchoolRole(schoolId, userId), false, [schoolId, userId]);
    const {data: assignees, loading: assigneesLoading, error: assigneesError} = useFetchData(() => fetchSchoolAssignees(schoolId), false, [schoolId]);

    return {
        school,
        schoolLoading,
        schoolError,
        teams,
        teamsLoading,
        teamsError,
        tournaments,
        tournamentsLoading,
        tournamentsError,
        students,
        studentsLoading,
        studentsError,
        roleData,
        roleLoading,
        roleError,
        assignees,
        assigneesLoading,
        assigneesError
    }
}