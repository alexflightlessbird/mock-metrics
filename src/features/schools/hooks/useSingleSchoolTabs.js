import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { hasLength, isInRange, isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useCases } from "../../../hooks/api/useCases";
import { useSchoolDataMutations } from "../../../hooks/api/useSchoolData";
import { TYPES, AREAS } from "../utils/schoolConstants";

export function useTeamFilters(initialStatus = "active", initialType = "all") {
    const [searchParams, setSearchParams] = useSearchParams();
    
    const status = searchParams.get("teamstatus") || initialStatus;
    const type = searchParams.get("teamtype") || initialType;

    function setStatus (newStatus) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("teamstatus", newStatus);
        setSearchParams(newSearchParams);
    }

    function setType (newType) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("teamtype", newType);
        setSearchParams(newSearchParams);
    }

    return { status, type, setStatus, setType };
}

export function useStudentFilters(initialStatus = "active") {
    const [searchParams, setSearchParams] = useSearchParams();

    const status = searchParams.get("studentstatus") || initialStatus;

    function setStatus (newStatus) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("studentstatus", newStatus);
        setSearchParams(newSearchParams);
    }

    return { status, setStatus };
}

export function useTournamentFilters(initialStatus = "active", initialType = "all", initialArea = "all") {
    const [searchParams, setSearchParams] = useSearchParams();

    const status = searchParams.get("tournamentstatus") || initialStatus;
    const type = searchParams.get("tournamenttype") || initialType;
    const area = searchParams.get("tournamentarea") || initialArea;

    function setStatus (newStatus) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("tournamentstatus", newStatus);
        setSearchParams(newSearchParams);
    }

    function setType (newType) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("tournamenttype", newType);
        setSearchParams(newSearchParams);
    }

    function setArea (newArea) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("tournamentarea", newArea);
        setSearchParams(newSearchParams);
    }

    return { status, type, area, setStatus, setType, setArea };
}

export function useAddTeamForm(schoolId) {
    const [opened, { open, close }] = useDisclosure(false);
    const { data: allCases = [] } = useCases();
    const { addTeam } = useSchoolDataMutations();

    const form = useForm({ 
        mode: "uncontrolled",
        validate: {
            name: hasLength({ min: 1, max: 15 }, "Must be 1-15 characters"),
            year: isInRange({ min: 1985, max: new Date().getFullYear() }, "Enter a valid year"),
            caseId: isNotEmpty("Select an option"),
            type: isNotEmpty("Select an option")
        },
        validateInputOnBlur: true,
        onSubmitPreventDefault: "always"
    });

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

    async function handleSubmit (values) {
        const { name, type, year, caseId } = values;
        const parsedCaseId = caseId === "null" ? null : Number(caseId);

        try {
            await addTeam({ name, type, year, caseId: parsedCaseId, schoolId });
            close();
        } catch (error) {
            console.error("Team add failed:", error);
        }
    }

    function openModal () {
        form.setValues({
            year: new Date().getFullYear(),
            caseId: "null",
            type: TYPES.PRESTACK
        });
        open();
    }

    return {
        opened,
        open: openModal,
        close,
        form,
        handleSubmit,
        caseOptions,
        typeOptions
    }
}

export function useAddStudentForm(schoolId) {
    const [opened, { open, close }] = useDisclosure(false);
    const { addStudent } = useSchoolDataMutations();

    const form = useForm({
        mode: "uncontrolled",
        validate: {
            name: hasLength({ min: 2, max: 40 }, "Must be 2-40 characters")
        },
        validateInputOnBlur: true,
        onSubmitPreventDefault: "always"
    });

    async function handleSubmit (values) {
        const { name } = values;

        try {
            await addStudent({ name, schoolId });
            close();
        } catch (error) {
            console.error("Student add failed:", error);
        }
    }

    return {
        opened,
        open,
        close,
        form,
        handleSubmit
    }
}

export function useAddTournamentForm(schoolId) {
    const [opened, { open, close }] = useDisclosure(false);
    const { data: allCases = [] } = useCases();
    const { addTournament } = useSchoolDataMutations();

    const form = useForm({
        mode: "uncontrolled",
        validate: {
            name: hasLength({ min: 2, max: 40 }, "Must be 2-40 characters"),
            year: isInRange({ min: 1985, max: new Date().getFullYear() }, "Enter a valid year"),
            caseId: isNotEmpty("Select an option"),
            type: isNotEmpty("Select an option"),
            area: isNotEmpty("Select an option")
        },
        validateInputOnBlur: true,
        onSubmitPreventDefault: "always"
    });

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

    async function handleSubmit (values) {
        const { name, year, type, area, caseId } = values;
        const parsedCaseId = caseId === "null" ? null : Number(caseId);

        try {
            await addTournament({ name, year, type, area, caseId: parsedCaseId, schoolId });
            close();
        } catch (error) {
            console.error("Tournament add failed:", error);
        }
    }

    function openModal () {
        form.setValues({
            year: new Date().getFullYear(),
            caseId: allCases[0]?.id.toString() || "null",
            type: TYPES.PRESTACK,
            area: AREAS.INVITATIONAL
        });
        open();
    }

    return {
        opened,
        open: openModal,
        close,
        form,
        handleSubmit,
        caseOptions,
        typeOptions,
        areaOptions
    }
}