// Dependency imports
import { useMemo } from "react";

// Utils imports
import { ROLES } from "../../../utils/constants";

function useRoleFilters(allItems) {
    return useMemo(() => {
        const safeItems = allItems || [];
        const primary = safeItems.filter((i) => i.role === ROLES.PRIMARY);
        const admin = safeItems.filter((i) => i.role === ROLES.ADMIN);
        const viewer = safeItems.filter((i) => i.role === ROLES.VIEWER);
        return { primary, admin, viewer };
    }, [allItems]);
}

export { useRoleFilters };