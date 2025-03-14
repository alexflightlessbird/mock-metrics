export function filterAssigneesByRole(assignees, role) {
    if (assignees) {
        return assignees
        .filter((a) => a.role === role)
        .map((a) => a.users)
        .flat();
    } else {
        return null;
    }
}