import { useUserAssignments } from "./useUserAssignments";

export function useGetRole(userId, schoolId) {
	const { assignments, isLoading } = useUserAssignments(userId);

	const role =
		assignments?.find((a) => a.school_id === schoolId)?.role || "viewer";

	return { role, isLoading };
}
