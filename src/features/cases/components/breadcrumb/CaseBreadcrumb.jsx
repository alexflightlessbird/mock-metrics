import Breadcrumb from "../../../../common/components/Breadcrumb";
import { Pill, useMantineTheme } from "@mantine/core";
import { Link, useSearchParams } from "react-router-dom";
import { useCases, useCaseWitnesses } from "../../../../hooks/api/useCases";
import { useMemo, Fragment } from "react";

export default function CaseBreadcrumb() {
    const theme = useMantineTheme();
    const [searchParams] = useSearchParams();
    const caseId = searchParams.get("caseId");
    const witnessId = searchParams.get("witnessId");

    const { data: allCases = [], isPending: isCasesPending } = useCases();
    const { data: allCaseWitnesses = [], isPending: isCaseWitnessesPending } = useCaseWitnesses(caseId);

    const inactiveProps = {
        size: "md",
        style: {
            backgroundColor: theme.colors.lightGray[0],
            color: theme.colors.darkBlue[0],
            border: "1px solid " + theme.colors.darkBlue[0],
        },
    };
    
    const activeProps = {
        size: "lg",
        style: {
            backgroundColor: theme.colors.primaryBlue[0],
            color: theme.colors.darkBlue[0],
        },
    };

    const selectedCase = useMemo(() => {
        if (!caseId) return null;
        return allCases.find((c) => c.id === parseInt(caseId)) || null;
    }, [caseId, allCases]);

    const selectedWitness = useMemo(() => {
        if (!witnessId) return null;
        return allCaseWitnesses.find((w) => w.id === parseInt(witnessId)) || null;
    }, [witnessId, allCaseWitnesses]);
    
    if (isCasesPending || (isCaseWitnessesPending && caseId)) return <div>Loading...</div>;

    const breadcrumbItems = [];

    const getBreadcrumbItems = () => {
        if (!caseId) return breadcrumbItems.push({ title: (<Pill {...activeProps}>Cases</Pill>)});
        if (caseId) {
            breadcrumbItems.push({ title: <Link to="/cases"><Pill {...inactiveProps}>Cases</Pill></Link>})
            if (!selectedCase) return breadcrumbItems.push({ title: <Pill {...activeProps}>Not Found</Pill>});
            if (!witnessId) return breadcrumbItems.push({ title: <Pill {...activeProps}>{selectedCase.name}</Pill>});
            breadcrumbItems.push({ title: <Link to={`/cases?caseId=${caseId}`}><Pill {...inactiveProps}>{selectedCase.name}</Pill></Link>});
            if (!selectedWitness) return breadcrumbItems.push({ title: <Pill {...activeProps}>Not Found</Pill>});
            breadcrumbItems.push({ title: <Pill {...activeProps}>{selectedWitness.name}</Pill>})
        }
    }
    
    getBreadcrumbItems();

    const breadcrumbItemsList = breadcrumbItems.map((item, index) => (
        <Fragment key={index}>{item.title}</Fragment>
    ));

    return <Breadcrumb>{breadcrumbItemsList}</Breadcrumb>;
}