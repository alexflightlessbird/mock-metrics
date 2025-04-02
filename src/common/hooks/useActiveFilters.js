// Dependency imports
import { useMemo } from "react";

export function useActiveFilters(allItems) {
  return useMemo(() => {
    const safeItems = allItems || [];
    const active = safeItems.filter((i) => i.is_active);
    const inactive = safeItems.filter((i) => !i.is_active);
    return {active, inactive};
  }, [allItems]);
}
