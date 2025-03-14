import { useParams } from "react-router-dom";
import { useSession } from "./auth/useSession";
import useFetchData from "./useFetchData";
import useSchoolData from "./useSchoolData";
import { fetchCases } from "../services/api/caseApi"; 

export function useSchool() {
    const { schoolId } = useParams();
    const { userId } = useSession();

    const {
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
    } = useSchoolData(schoolId, userId);

    const { data: cases, loading: casesLoading, error: casesError } = useFetchData(() => fetchCases(), false, []);

    const role = roleData?.role;
    const isAdmin = role === "Primary" || role === "Admin";
    const isPrimaryAdmin = role === "Primary";

    const handleTeamAdded = (newTeam) => {
        setTeams((prevTeams) => [...prevTeams, newTeam]);
    }

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
        role,
        roleLoading,
        roleError,
        assignees,
        assigneesLoading,
        assigneesError,
        cases,
        casesLoading,
        casesError,
        isAdmin,
        isPrimaryAdmin,
        handleTeamAdded,
    }
}