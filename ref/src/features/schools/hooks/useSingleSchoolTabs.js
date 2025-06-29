import { useMemo } from "react";
import { hasLength, isInRange, isNotEmpty } from "@mantine/form";
import { useCases } from "../../../hooks/api/useCases";
import { useSchoolDataMutations } from "../../../hooks/api/useSchoolData";
import { TYPES, AREAS } from "../utils/schoolConstants";
import useQueryParamFilter from "../../../common/hooks/useQueryParamFilter";
import useBaseForm from "./useBaseForm";

export function useTeamFilters(initialStatus = "active", initialType = "all") {
    const { getParam, setParam } = useQueryParamFilter({
        teamstatus: initialStatus,
        teamtype: initialType
    });

    return {
        status: getParam("teamstatus"),
        type: getParam("teamtype"),
        setStatus: (value) => setParam("teamstatus", value),
        setType: (value) => setParam("teamtype", value)
    }
}

export function useStudentFilters(initialStatus = "active") {
    const { getParam, setParam } = useQueryParamFilter({
        studentstatus: initialStatus
    });

    return {
        status: getParam("studentstatus"),
        setStatus: (value) => setParam("studentstatus", value)
    }
}

export function useTournamentFilters(initialStatus = "active", initialType = "all", initialArea = "all") {
    const { getParam, setParam } = useQueryParamFilter({
        tournamentstatus: initialStatus,
        tournamenttype: initialType,
        tournamentarea: initialArea
    });

    return {
        status: getParam("tournamentstatus"),
        type: getParam("tournamenttype"),
        area: getParam("tournamentarea"),
        setStatus: (value) => setParam("tournamentstatus", value),
        setType: (value) => setParam("tournamenttype", value),
        setArea: (value) => setParam("tournamentarea", value)
    }
}

export function useAddTeamForm(schoolId) {
    const { data: allCases = [] } = useCases();
    const { addTeam } = useSchoolDataMutations();

    const caseOptions = useMemo(() => [
        { value: "null", label: "None" },
        ...allCases.map((c) => ({
            value: c.id.toString(),
            label: c.name
        }))
    ], [allCases]);

    const typeOptions = [
        { value: TYPES.PRESTACK, label: TYPES.PRESTACK },
        { value: TYPES.POSTSTACK, label: TYPES.POSTSTACK }
    ];

    const form = useBaseForm({
        initialValues: {
            year: new Date().getFullYear(),
            caseId: "null",
            type: TYPES.PRESTACK
        },
        validate: {
            name: hasLength({ min: 1, max: 15 }, "Must be 1-15 characters"),
            year: isInRange({ min: 1985, max: new Date().getFullYear() }, "Enter a valid year"),
            caseId: isNotEmpty("Select an option"),
            type: isNotEmpty("Select an option")
        },
        mutationFn: (values) => {
            const { name, type, year, caseId } = values;
            const parsedCaseId = caseId === "null" ? null : Number(caseId);
            return addTeam({ name, type, year, caseId: parsedCaseId, schoolId });
        }
    })

    return {
        ...form,
        caseOptions,
        typeOptions
    }
}

export function useAddStudentForm(schoolId) {
    const { addStudent } = useSchoolDataMutations();

    const form = useBaseForm({
        initialValues: {},
        validate: {
            name: hasLength({ min: 2, max: 40 }, "Must be 2-40 characters")
        },
        mutationFn: (values) => {
            const { name } = values;
            return addStudent({ name, schoolId });
        }
    })

    return {
        ...form
    }
}

export function useAddTournamentForm(schoolId) {
    const { data: allCases = [] } = useCases();
    const { addTournament } = useSchoolDataMutations();

    const caseOptions = useMemo(() => [
        { value: "null", label: "None" },
        ...allCases.map((c) => ({
            value: c.id.toString(),
            label: c.name
        }))
    ], [allCases]);

    const typeOptions = [
        { value: TYPES.PRESTACK, label: TYPES.PRESTACK },
        { value: TYPES.POSTSTACK, label: TYPES.POSTSTACK }
    ];

    const areaOptions = [
        { value: AREAS.INVITATIONAL, label: AREAS.INVITATIONAL },
        { value: AREAS.REGIONALS, label: AREAS.REGIONALS },
        { value: AREAS.ORCS, label: AREAS.ORCS },
        { value: AREAS.NATIONALS, label: AREAS.NATIONALS },
        { value: AREAS.ROOKIERUMBLE, label: AREAS.ROOKIERUMBLE },
        { value: AREAS.OLT, label: AREAS.OLT },
        { value: AREAS.OTHER, label: AREAS.OTHER }
    ];

    const form = useBaseForm({
        initialValues: {
            year: new Date().getFullYear(),
            caseId: allCases[0]?.id.toString() || "null",
            type: TYPES.PRESTACK,
            area: AREAS.INVITATIONAL
        },
        validate: {
            name: hasLength({ min: 2, max: 40 }, "Must be 2-40 characters"),
            year: isInRange({ min: 1985, max: new Date().getFullYear() }, "Enter a valid year"),
            caseId: isNotEmpty("Select an option"),
            type: isNotEmpty("Select an option"),
            area: isNotEmpty("Select an option")
        },
        mutationFn: (values) => {
            const { name, year, type, area, caseId } = values;
            const parsedCaseId = caseId === "null" ? null : Number(caseId);
            return addTournament({ name, year, type, area, caseId: parsedCaseId, schoolId });
        }
    })

    return {
        ...form,
        caseOptions,
        typeOptions,
        areaOptions
    }
}