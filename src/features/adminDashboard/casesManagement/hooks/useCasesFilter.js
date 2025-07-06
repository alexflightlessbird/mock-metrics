import { useMemo } from "react";

export default function useCasesFilter({ data, searchTerm, searchColumn }) {
  const cases = data;
  return useMemo(() => {
    if (!cases) return [];
    if (!searchTerm) return cases;

    const lowerSearchTerm = searchTerm.toLowerCase();

    if (searchColumn === "all") {
      return cases.filter(
        (caseVal) =>
          caseVal.name.toString().toLowerCase().includes(lowerSearchTerm) ||
          caseVal.year.toString().toLowerCase().includes(lowerSearchTerm) ||
          caseVal.type.toString().toLowerCase().includes(lowerSearchTerm) ||
          caseVal.area.toString().toLowerCase().includes(lowerSearchTerm)
      );
    }

    return cases.filter((caseVal) =>
      String(caseVal[searchColumn]).toLowerCase().includes(lowerSearchTerm)
    );
  }, [cases, searchTerm, searchColumn]);
}
