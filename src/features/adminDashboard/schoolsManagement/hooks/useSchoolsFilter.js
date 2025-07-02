import { useMemo } from "react";

export default function useSchoolsFilter ({ schools, searchTerm, searchColumn }) {
    return useMemo(() => {
        if (!schools) return [];
        if (!searchTerm) return schools;

        const lowerSearchTerm = searchTerm.toLowerCase();
        
        if (searchColumn === "all") {
            return schools.filter(school =>
                school.id.toString().toLowerCase().includes(lowerSearchTerm) ||
                school.name.toString().toLowerCase().includes(lowerSearchTerm) ||
                school.short_name.toString().toLowerCase().includes(lowerSearchTerm)
            )
        };

        return schools.filter(school =>
            String(school[searchColumn]).toLowerCase().includes(lowerSearchTerm)
        );
    }, [schools, searchTerm, searchColumn]);
}