// Dependency imports
import { useMemo } from "react";

function useCaseFilters(allCases) {
  return useMemo(() => {
    const safeCases = allCases || [];
    const active = safeCases.filter((c) => c.is_active);
    const inactive = safeCases.filter((c) => !c.is_active);
    return [active, inactive];
  }, [allCases]);
}

export { useCaseFilters };