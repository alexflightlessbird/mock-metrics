import { useMemo } from "react";
import { ROLES } from "../../../utils/constants";

export function useSchoolFilters(allSchools) {
  return useMemo(() => {
    const safeSchools = allSchools || [];
    const primary = safeSchools.filter((s) => s.role === ROLES.PRIMARY);
    const admin = safeSchools.filter((s) => s.role === ROLES.ADMIN);
    const viewer = safeSchools.filter((s) => s.role === ROLES.VIEWER);
    return [primary, admin, viewer];
  }, [allSchools]);
}
