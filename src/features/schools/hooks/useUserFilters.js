import { useMemo } from "react";
import { ROLES } from "../../../utils/constants";

export function useUserFilters(allUsers) {
  return useMemo(() => {
    const safeUsers = allUsers || [];
    const primary = safeUsers.filter((u) => u.role === ROLES.PRIMARY);
    const admin = safeUsers.filter((u) => u.role === ROLES.ADMIN);
    const viewer = safeUsers.filter((u) => u.role === ROLES.VIEWER);
    return [primary, admin, viewer];
  }, [allUsers]);
}
