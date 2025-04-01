import { useMemo } from "react";
import { ROLES } from "../../../utils/constants";

export function useRoleFilters(allItems) {
    return useMemo(() => {
        const safeItems = allItems || [];
        const primary = safeItems.filter((i) => i.role === ROLES.PRIMARY);
        const admin = safeItems.filter((i) => i.role === ROLES.ADMIN);
        const viewer = safeItems.filter((i) => i.role === ROLES.VIEWER);
        return { primary, admin, viewer };
    }, [allItems]);
}